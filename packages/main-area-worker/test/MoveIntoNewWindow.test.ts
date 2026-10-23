import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../src/parts/EditorInput/EditorInput.ts'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { Tab } from '../src/parts/Tab/Tab.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { moveIntoNewWindow } from '../src/parts/MoveIntoNewWindow/MoveIntoNewWindow.ts'

const createState = (tab: Partial<Tab> = {}): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        direction: 1,
        id: 1,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [{ editorUid: -1, icon: '', id: 1, isDirty: false, isPreview: false, title: 'file.txt', uri: '/workspace/file.txt', ...tab }],
      },
    ],
  },
})

test('moves a legacy file tab after destination readiness', async () => {
  using mockRpc = RendererWorker.registerMockRpc({ 'ElectronWindow.openNewWithEditorInput': async () => {} })
  const result = await moveIntoNewWindow(createState())
  expect(mockRpc.invocations.filter(([command]) => !command.startsWith('CacheStorage.'))).toEqual([
    ['ElectronWindow.openNewWithEditorInput', { type: 'editor', uri: '/workspace/file.txt' }, -1, false],
  ])
  expect(result.layout.groups).toEqual([])
})

test.each<EditorInput>([
  { type: 'process-explorer' },
  { type: 'running-extensions' },
  { providerId: 'heap-snapshot-viewer', type: 'webview', uri: 'file:///snapshot.heapsnapshot' },
  { type: 'diff-editor', uriLeft: 'file:///before', uriRight: 'file:///after' },
])('preserves typed input %j, including inputs without a uri', async (editorInput) => {
  using mockRpc = RendererWorker.registerMockRpc({ 'ElectronWindow.openNewWithEditorInput': async () => {} })
  const result = await moveIntoNewWindow(createState({ editorInput, uri: undefined }))
  expect(mockRpc.invocations[0]).toEqual(['ElectronWindow.openNewWithEditorInput', editorInput, -1, false])
  expect(result.layout.groups).toEqual([])
})

test('retains source when destination initialization fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ElectronWindow.openNewWithEditorInput': async () => {
      throw new Error('failed to initialize')
    },
  })
  const state = createState({ isDirty: true })
  await expect(moveIntoNewWindow(state)).rejects.toThrow('failed to initialize')
  expect(state.layout.groups[0].tabs).toHaveLength(1)
  expect(mockRpc.invocations).toHaveLength(1)
})

test('waits for destination and moves dirty input without a save prompt', async () => {
  const { promise, resolve } = Promise.withResolvers<void>()
  using mockRpc = RendererWorker.registerMockRpc({ 'ElectronWindow.openNewWithEditorInput': () => promise })
  const state = createState({ isDirty: true })
  let completed = false
  const moving = (async () => {
    const result = await moveIntoNewWindow(state)
    completed = true
    return result
  })()
  await Promise.resolve()
  expect(completed).toBe(false)
  expect(state.layout.groups[0].tabs).toHaveLength(1)
  resolve()
  const result = await moving
  expect(result.layout.groups).toEqual([])
  expect(mockRpc.invocations).toHaveLength(1)
})

test.each([{ uri: undefined }, { terminal: true }, { editorInput: undefined, uri: undefined }])('ignores non-transferable tabs %j', async (tab) => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const state = createState(tab)
  expect(await moveIntoNewWindow(state)).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('ignores missing active group/tab', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const empty = createDefaultState()
  expect(await moveIntoNewWindow(empty)).toBe(empty)
  const state = createState()
  const noActiveTab = { ...state, layout: { ...state.layout, groups: [{ ...state.layout.groups[0], activeTabId: -1 }] } }
  expect(await moveIntoNewWindow(noActiveTab)).toBe(noActiveTab)
  const missingTab = { ...state, layout: { ...state.layout, groups: [{ ...state.layout.groups[0], activeTabId: 100 }] } }
  expect(await moveIntoNewWindow(missingTab)).toBe(missingTab)
  expect(mockRpc.invocations).toEqual([])
})
