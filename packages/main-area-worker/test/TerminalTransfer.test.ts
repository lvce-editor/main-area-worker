import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { RendererWorker, DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { ensureActiveGroup } from '../src/parts/EnsureActiveGroup/EnsureActiveGroup.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'
import { renderDragData } from '../src/parts/RenderDragData/RenderDragData.ts'
import { saveState } from '../src/parts/SaveState/SaveState.ts'
import {
  receiveTerminal,
  releaseTerminal,
  handleTerminalExit,
  handlePanelDrop,
  parseTerminalDrag,
} from '../src/parts/TerminalTransfer/TerminalTransfer.ts'

const createContext = (): AsyncCommandContext<MainAreaState> => {
  let state: MainAreaState = { ...createDefaultState(), height: 600, initial: false, uid: 100, width: 800 }
  return {
    getState: () => state,
    updateState: async (fn) => {
      state = fn(state)
      return state
    },
  }
}

const descriptor = { icon: 'terminal-bash', label: 'bash' }
const drag = { sourceUid: 200, terminalUid: 300 }

test.each([
  '',
  'lvce-terminal:{',
  'lvce-terminal:null',
  'lvce-terminal:{}',
  'lvce-terminal:{"sourceUid":-1,"terminalUid":300}',
  'lvce-terminal:{"sourceUid":200,"terminalUid":"300"}',
])('rejects invalid terminal payload %s', (value) => {
  expect(parseTerminalDrag([value])).toBeUndefined()
})

test('parses a terminal payload without interpreting it as a file', () => {
  expect(parseTerminalDrag([`lvce-terminal:${JSON.stringify(drag)}`])).toEqual(drag)
})

test('adopts the live uid and releases it without creating or disposing a shell', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.attachPanelTerminal': () => true,
    'TerminalTransfer.beginPanelTransfer': () => true,
    'TerminalTransfer.commit': () => {},
    'TerminalTransfer.resize': () => {},
    'TerminalTransfer.takePanelTerminal': () => descriptor,
    'Viewlet.focusSelector': () => {},
  })
  const context = createContext()
  await receiveTerminal(context, drag)
  const state = context.getState()
  const tab = state.layout.groups[0].tabs[0]
  expect(tab).toMatchObject({ editorUid: 300, isPreview: false, loadingState: 'loaded', terminal: true, title: 'bash' })
  expect(saveState(state).layout.groups[0].tabs).toEqual([])
  const commands = renderDragData(state, { ...state, pointerDownGroupIndex: 0, pointerDownTabIndex: 0 })
  expect(commands[2].items).toEqual([{ data: 'lvce-terminal:{"sourceUid":100,"terminalUid":300}', type: 'application/x-lvce-terminal' }])
  await releaseTerminal(context, 300, 200)
  expect(context.getState().layout.groups).toEqual([])
  expect(rpc.invocations.map((item) => item[0])).toEqual([
    'TerminalTransfer.takePanelTerminal',
    'TerminalTransfer.resize',
    'Layout.renderMainAreaPending',
    'Viewlet.focusSelector',
    'TerminalTransfer.commit',
    'TerminalTransfer.beginPanelTransfer',
    'Layout.renderMainAreaPending',
    'TerminalTransfer.attachPanelTerminal',
  ])
})

test.each(['TerminalTransfer.resize', 'TerminalTransfer.commit', 'Layout.renderMainAreaPending'])(
  'rolls back a failed destination: %s',
  async (failure) => {
    using rpc = RendererWorker.registerMockRpc({
      'Layout.renderMainAreaPending': () => {
        if (failure === 'Layout.renderMainAreaPending') throw new Error('attachment failed')
      },
      'TerminalTransfer.beginPanelTransfer': () => true,
      'TerminalTransfer.commit': () => {
        if (failure === 'TerminalTransfer.commit') throw new Error('attachment failed')
      },
      'TerminalTransfer.resize': () => {
        if (failure === 'TerminalTransfer.resize') throw new Error('attachment failed')
      },
      'TerminalTransfer.rollback': () => {},
      'TerminalTransfer.takePanelTerminal': () => descriptor,
      'Viewlet.focusSelector': () => {},
    })
    const context = createContext()
    await expect(receiveTerminal(context, drag)).rejects.toThrow('attachment failed')
    expect(context.getState().layout.groups).toEqual([])
    expect(rpc.invocations.at(-1)).toEqual(['TerminalTransfer.rollback', 300])
  },
)

test('rejects stale source and destination without changing ownership', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.beginPanelTransfer': () => true,
    'TerminalTransfer.takePanelTerminal': () => undefined,
    'Viewlet.focusSelector': () => {},
  })
  const context = createContext()
  const initial = context.getState()
  await receiveTerminal(context, drag)
  await releaseTerminal(context, 300, 200)
  expect(context.getState()).toBe(initial)
  expect(handleTerminalExit(initial, 300)).toBe(initial)
  expect(rpc.invocations).toHaveLength(1)
})

test('a refused panel attachment retains the main tab; exit removes it', async () => {
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.attachPanelTerminal': () => {},
    'TerminalTransfer.beginPanelTransfer': () => false,
    'TerminalTransfer.commit': () => {},
    'TerminalTransfer.resize': () => {},
    'TerminalTransfer.takePanelTerminal': () => descriptor,
    'Viewlet.focusSelector': () => {},
  })
  const context = createContext()
  await receiveTerminal(context, drag)
  const initial = context.getState()
  await releaseTerminal(context, 300, 200)
  expect(context.getState()).toBe(initial)
  expect(handleTerminalExit(initial, 300).layout.groups).toEqual([])
})

test('panel drops ignore file data and mismatched source views', async () => {
  using _rpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItemsByDropId': () => ({ files: [], strings: ['file:///tmp/a'], uris: [] }),
  })
  const context = createContext()
  const initial = context.getState()
  await handlePanelDrop(context, 200, 1)
  expect(context.getState()).toBe(initial)
})

test('failed panel attachment restores the main source tab', async () => {
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.attachPanelTerminal': () => {
      throw new Error('attachment failed')
    },
    'TerminalTransfer.beginPanelTransfer': () => true,
    'TerminalTransfer.cancelPanelTransfer': () => true,
    'TerminalTransfer.commit': () => {},
    'TerminalTransfer.resize': () => {},
    'TerminalTransfer.takePanelTerminal': () => descriptor,
    'Viewlet.focusSelector': () => {},
  })
  const context = createContext()
  await receiveTerminal(context, drag)
  const original = context.getState().layout
  await expect(releaseTerminal(context, 300, 200)).rejects.toThrow('attachment failed')
  expect(context.getState().layout).toBe(original)
})

test('drops a panel terminal beside an existing preview without replacing it', async () => {
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.commit': () => {},
    'TerminalTransfer.resize': () => {},
    'TerminalTransfer.takePanelTerminal': () => descriptor,
    'Viewlet.focusSelector': () => {},
  })
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItemsByDropId': () => ({ files: [], strings: [`lvce-terminal:${JSON.stringify(drag)}`], uris: [] }),
  })
  const context = createContext()
  await context.updateState((state) => ensureActiveGroup(state, 'file:///preview.ts', true))
  const group = context.getState().layout.groups[0]
  const previewId = group.tabs[0].id
  await context.updateState((state) => ({ ...state, dragOverlay: { height: 600, targetGroupId: group.id, width: 800, x: 0, y: 0 } }))
  await handleDrop(context, 1)
  expect(context.getState().layout.groups[0].tabs).toHaveLength(2)
  expect(context.getState().layout.groups[0].tabs[0]).toMatchObject({ id: previewId, isPreview: false })
})

test.each([true, false])('moves an existing main terminal without transferring ownership (tab indicator: %s)', async (indicator) => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.commit': () => {},
    'TerminalTransfer.resize': () => {},
    'TerminalTransfer.takePanelTerminal': () => descriptor,
    'Viewlet.focusSelector': () => {},
  })
  const context = createContext()
  await receiveTerminal(context, drag)
  await receiveTerminal(context, { ...drag, terminalUid: 301 })
  const group = context.getState().layout.groups[0]
  await context.updateState((state) => ({
    ...state,
    dragOverlay: { height: 600, targetGroupId: group.id, width: 800, x: 0, y: 0 },
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 1,
    ...(indicator && { tabDropIndicator: { groupId: group.id, index: 0 } }),
  }))
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItemsByDropId': () => ({ files: [], strings: ['lvce-terminal:{"sourceUid":100,"terminalUid":301}'], uris: [] }),
  })
  const before = rpc.invocations.length
  await handleDrop(context, 2)
  const { tabs } = context.getState().layout.groups[0]
  expect(tabs.map((tab) => tab.editorUid).toSorted((a, b) => a - b)).toEqual([300, 301])
  expect(tabs.map((tab) => tab.editorUid)).toEqual(indicator ? [301, 300] : [300, 301])
  expect(rpc.invocations).toHaveLength(before)
  expect(context.getState().pointerDownTabIndex).toBe(-1)
})

test('ignores stale main terminal drags and clears terminal drag data after cancellation', async () => {
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.commit': () => {},
    'TerminalTransfer.resize': () => {},
    'TerminalTransfer.takePanelTerminal': () => descriptor,
    'Viewlet.focusSelector': () => {},
  })
  const context = createContext()
  await receiveTerminal(context, drag)
  const initial = context.getState()
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItemsByDropId': () => ({ files: [], strings: ['lvce-terminal:{"sourceUid":100,"terminalUid":999}'], uris: [] }),
  })
  await handleDrop(context, 3)
  expect(context.getState().layout).toBe(initial.layout)
  expect(renderDragData({ ...initial, pointerDownGroupIndex: 0, pointerDownTabIndex: 0 }, initial)).toEqual([
    'Viewlet.setDragData',
    100,
    { items: [], label: '' },
  ])
})

test('routes a main terminal drop to the panel and does not resurrect a terminal that exits during failed attachment', async () => {
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.renderMainAreaPending': () => {},
    'TerminalTransfer.attachPanelTerminal': () => {
      throw new Error('terminal exited')
    },
    'TerminalTransfer.beginPanelTransfer': () => true,
    'TerminalTransfer.cancelPanelTransfer': () => false,
    'TerminalTransfer.commit': () => {},
    'TerminalTransfer.resize': () => {},
    'TerminalTransfer.takePanelTerminal': () => descriptor,
    'Viewlet.focusSelector': () => {},
  })
  const context = createContext()
  await receiveTerminal(context, drag)
  using _dragRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.getDroppedItemsByDropId': () => ({ files: [], strings: ['lvce-terminal:{"sourceUid":100,"terminalUid":300}'], uris: [] }),
  })
  await expect(handlePanelDrop(context, 200, 3)).rejects.toThrow('terminal exited')
  expect(context.getState().layout.groups).toEqual([])
})

test('accepts fractional renderer viewlet ids used by the live application', () => {
  expect(parseTerminalDrag(['lvce-terminal:{"sourceUid":0.3915119890430704,"terminalUid":0.8123456789}'])).toEqual({
    sourceUid: 0.3915119890430704,
    terminalUid: 0.8123456789,
  })
})
