import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { disposeEditors, flushDeferredDisposals } from '../src/parts/DisposeEditors/DisposeEditors.ts'
import { getFilteredGroups } from '../src/parts/GetFilteredGroups/GetFilteredGroups.ts'
import { getMountedViewletUids } from '../src/parts/GetMountedViewletUids/GetMountedViewletUids.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { renderEditorGroup } from '../src/parts/RenderEditorGroup/RenderEditorGroup.ts'

const invoke = jest.fn((..._args: readonly unknown[]) => undefined)
const tab = (id: number, loadingState: Tab['loadingState'] = 'loaded'): Tab => ({
  editorUid: id + 100,
  icon: 'file.svg',
  id,
  isDirty: false,
  isPreview: false,
  loadingState,
  title: `${id}.txt`,
  uri: `file:///${id}.txt`,
})
const initial = (): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      { activeTabId: 1, direction: 1, id: 1, isEmpty: false, isFocused: true, size: 50, tabs: [tab(1), tab(2, 'loading'), tab(3, 'loading')] },
      { activeTabId: 4, direction: 1, id: 2, isEmpty: false, isFocused: false, size: 50, tabs: [tab(4), tab(5, 'loading')] },
    ],
  },
  uid: 1,
})
const select = (state: MainAreaState, id: number, groupId = 1): MainAreaState => ({
  ...state,
  layout: { ...state.layout, groups: state.layout.groups.map((group) => (group.id === groupId ? { ...group, activeTabId: id } : group)) },
})
const commit = (state: MainAreaState): MainAreaState => {
  const previous = MainAreaStates.get(1)?.newState ?? initial()
  MainAreaStates.set(1, previous, state)
  return MainAreaStates.get(1).newState
}

beforeEach(() => {
  jest.useFakeTimers()
  invoke.mockClear()
  RendererWorker.set(
    createMockRpc({
      commandMap: {
        'Layout.handleActiveEditorChange': () => undefined,
        'Layout.renderMainAreaPending': (...args: readonly unknown[]) => invoke('render', ...args),
        'Layout.setMountedViewlets': (...args: readonly unknown[]) => invoke('mounted', ...args),
        'Viewlet.dispose': (...args: readonly unknown[]) => invoke('dispose', ...args),
      },
    }),
  )
  const state = initial()
  MainAreaStates.set(1, state, state)
})
afterEach(async () => {
  MainAreaStates.clear()
  await flushDeferredDisposals()
  jest.useRealTimers()
})

test('holds the outgoing reference, makes its container inert, and preserves the selected icon', async () => {
  const state = commit(select(initial(), 2))
  expect(getMountedViewletUids(state)).toEqual([101, 104])
  const dom = renderEditorGroup(state.layout.groups[0], 0)
  expect(dom).toContainEqual(expect.objectContaining({ className: 'EditorContainer', inert: true }))
  expect(dom).toContainEqual(expect.objectContaining({ uid: 101 }))
  expect(state.layout.groups[0].tabs[1].icon).toBe('file.svg')
  await jest.advanceTimersByTimeAsync(99)
  expect(MainAreaStates.get(1).newState.layout.groups[0].paintHold).toBeDefined()
  await jest.advanceTimersByTimeAsync(1)
  const expired = MainAreaStates.get(1).newState
  expect(expired.layout.groups[0].paintHold).toBeUndefined()
  expect(getMountedViewletUids(expired)).toEqual([104])
  expect(renderEditorGroup(expired.layout.groups[0], 0)).not.toContainEqual(expect.objectContaining({ uid: 101 }))
  expect(invoke).toHaveBeenCalledWith('render', 1)
})

test.each(['loaded', 'error', 'binary', 'large'] as const)('finishes immediately on %s without a delayed spinner', async (loadingState) => {
  const held = commit(select(initial(), 2))
  const ready = commit({
    ...held,
    layout: {
      ...held.layout,
      groups: held.layout.groups.map((group) => ({
        ...group,
        tabs: group.tabs.map((item) => (item.id === 2 ? { ...item, loadingState } : item)),
      })),
    },
  })
  expect(ready.layout.groups[0].paintHold).toBeUndefined()
  expect(jest.getTimerCount()).toBe(0)
  await jest.advanceTimersByTimeAsync(100)
  expect(invoke).not.toHaveBeenCalledWith('render', 1)
})

test('rapid A to B to C selections retain A with the original deadline', async () => {
  const held = commit(select(initial(), 2))
  await jest.advanceTimersByTimeAsync(60)
  const next = commit(select(held, 3))
  expect(next.layout.groups[0].paintHold?.tab.id).toBe(1)
  expect(jest.getTimerCount()).toBe(1)
  await jest.advanceTimersByTimeAsync(40)
  expect(MainAreaStates.get(1).newState.layout.groups[0].paintHold).toBeUndefined()
  expect(MainAreaStates.get(1).newState.layout.groups[0].activeTabId).toBe(3)
  // An async legacy command must not resurrect an expired presentation.
  expect(commit(next).layout.groups[0].paintHold).toBeUndefined()
})

test('split groups expire independently', async () => {
  const left = commit(select(initial(), 2))
  await jest.advanceTimersByTimeAsync(50)
  commit(select(left, 5, 2))
  await jest.advanceTimersByTimeAsync(50)
  expect(getMountedViewletUids(MainAreaStates.get(1).newState)).toEqual([104])
  await jest.advanceTimersByTimeAsync(50)
  expect(getMountedViewletUids(MainAreaStates.get(1).newState)).toEqual([])
})

test('closing a group or disposing the component cancels its timer', async () => {
  const held = commit(select(initial(), 2))
  commit({ ...held, layout: { ...held.layout, groups: held.layout.groups.slice(1) } })
  expect(jest.getTimerCount()).toBe(0)
  commit(select(initial(), 2))
  MainAreaStates.dispose(1)
  expect(jest.getTimerCount()).toBe(0)
  await jest.advanceTimersByTimeAsync(100)
  expect(invoke).not.toHaveBeenCalledWith('render', 1)
})

test('preview replacement delays disposal until the retained viewlet is detached', async () => {
  const state = select(initial(), 2)
  const groups = state.layout.groups.map((group) => ({ ...group, tabs: group.tabs.filter((item) => item.id !== 1) }))
  commit({ ...state, layout: { ...state.layout, groups } })
  await disposeEditors([101])
  expect(invoke).not.toHaveBeenCalledWith('dispose', 101)
  await jest.advanceTimersByTimeAsync(100)
  expect(invoke).toHaveBeenCalledWith('dispose', 101)
})

test('async registry updates and regular command results both use presentation', async () => {
  const open = MainAreaStates.wrapAsyncCommand(async (context) => {
    await context.updateState((state) => select(state, 2))
    expect(context.getState().layout.groups[0].paintHold?.tab.id).toBe(1)
  })
  await open(1)
  const switchBack = MainAreaStates.wrapSerialCommand((state) => select(state, 1))
  await switchBack(1)
  expect(MainAreaStates.get(1).newState.layout.groups[0].paintHold).toBeUndefined()
})

test('session state excludes retained references and timer tokens', () => {
  const held = commit(select(initial(), 2))
  expect(getFilteredGroups(held.layout.groups)[0]).not.toHaveProperty('paintHold')
})

test('slow command notifications cannot restore a hold after its deadline', async () => {
  const { promise: pending, resolve: release } = Promise.withResolvers<void>()
  RendererWorker.set(
    createMockRpc({
      commandMap: {
        'Layout.handleActiveEditorChange': () => pending,
        'Layout.renderMainAreaPending': () => undefined,
        'Layout.setMountedViewlets': () => undefined,
      },
    }),
  )
  const switchTab = MainAreaStates.wrapSerialCommand((state) => select(state, 2))
  const switching = switchTab(1)
  await jest.advanceTimersByTimeAsync(100)
  expect(MainAreaStates.get(1).newState.layout.groups[0].paintHold).toBeUndefined()
  release()
  await switching
  expect(MainAreaStates.get(1).newState.layout.groups[0].paintHold).toBeUndefined()
})

test('a command finishing after disposal cannot mutate a recreated component', async () => {
  const { promise: pending, resolve: release } = Promise.withResolvers<void>()
  const switchTab = MainAreaStates.wrapCommand(async (state) => {
    await pending
    return select(state, 2)
  })
  const switching = switchTab(1)
  MainAreaStates.dispose(1)
  const fresh = initial()
  MainAreaStates.set(1, fresh, fresh)
  release()
  await switching
  expect(MainAreaStates.get(1).newState).toBe(fresh)
  expect(jest.getTimerCount()).toBe(0)
})
