import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { RendererWorker, DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
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
