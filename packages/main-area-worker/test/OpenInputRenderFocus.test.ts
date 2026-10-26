import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { openInput, openInputWithContext } from '../src/parts/OpenInput/OpenInput.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test.each([
  { expected: ['render', 'focus'], focus: true, initialCursorPosition: undefined },
  { expected: ['render'], focus: false, initialCursorPosition: undefined },
  { expected: ['render', 'cursor', 'render', 'focus'], focus: true, initialCursorPosition: { columnIndex: 3, rowIndex: 2 } },
  { expected: ['render', 'cursor'], focus: false, initialCursorPosition: { columnIndex: 3, rowIndex: 2 } },
])('open commits before cursor/focus with $focus and $initialCursorPosition', async ({ expected, focus, initialCursorPosition }) => {
  MainAreaStates.clear()
  const events: string[] = []
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': () => {},
    'Layout.getModuleId': () => 'Editor',
    'Layout.renderMainAreaPending': () => {
      events.push('render')
    },
    'Viewlet.executeViewletCommand': () => {
      events.push('cursor')
    },
  })
  RendererProcess.set(
    createMockRpc({
      commandMap: {
        'Viewlet.focusSelector': () => {
          events.push('focus')
        },
        'Viewlet.focusSelectorAfterRender': () => {},
      },
    }),
  )
  const result = await openInput(createDefaultState(), {
    editorInput: { type: 'editor', uri: 'file:///hello.txt' },
    focus,
    initialCursorPosition,
    preview: true,
  })
  expect(events).toEqual(expected)
  expect(result.layout.groups[0].tabs[0]).toMatchObject({ isPreview: true, loadingState: 'loaded', uri: 'file:///hello.txt' })
  MainAreaStates.clear()
})

test('open still commits a ready editor when its tab loses selection during loading', async () => {
  let state = createDefaultState()
  const context: AsyncCommandContext<MainAreaState> = {
    getState: () => state,
    updateState: (updater) => {
      state = updater(state)
      return Promise.resolve(state)
    },
  }
  const events: string[] = []
  using _rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': () => {
      state = { ...state, layout: { ...state.layout, groups: state.layout.groups.map((group) => ({ ...group, activeTabId: -1 })) } }
    },
    'Layout.getModuleId': () => 'Editor',
    'Layout.renderMainAreaPending': () => {
      events.push('render')
    },
  })
  RendererProcess.set(
    createMockRpc({
      commandMap: {
        'Viewlet.focusSelector': () => {
          events.push('focus')
        },
      },
    }),
  )
  await openInputWithContext(context, { editorInput: { type: 'editor', uri: 'file:///hello.txt' }, focus: true })
  expect(events).toEqual(['render'])
  expect(state.layout.groups[0].tabs[0].loadingState).toBe('loaded')
})
