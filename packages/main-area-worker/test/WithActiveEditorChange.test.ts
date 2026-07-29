import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { withActiveEditorChange, withActiveEditorChangeAsync } from '../src/parts/WithActiveEditorChange/WithActiveEditorChange.ts'

const createState = (uri: string): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        isEmpty: false,
        size: 100,
        tabs: [
          {
            editorType: 'text',
            editorUid: 1,
            icon: '',
            id: 1,
            isDirty: false,
            isPreview: false,
            title: 'file.txt',
            uri,
          },
        ],
      },
    ],
  },
})

test('wraps state commands and notifies after their result is available', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleActiveEditorChange': () => undefined,
  })
  const oldState = createState('file:///one.txt')
  const newState = createState('file:///two.txt')
  const wrapped = withActiveEditorChange(() => newState)
  await expect(wrapped(oldState)).resolves.toBe(newState)
  expect(mockRpc.invocations).toEqual([['Layout.handleActiveEditorChange', 'file:///two.txt']])
})

test('wraps context commands and notifies after their final update', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleActiveEditorChange': () => undefined,
  })
  let state = createState('file:///one.txt')
  const context: AsyncCommandContext<MainAreaState> = {
    getState: () => state,
    updateState: async (updater) => {
      state = updater(state)
      return state
    },
  }
  const wrapped = withActiveEditorChangeAsync(async (commandContext) => {
    await commandContext.updateState(() => createState('file:///two.txt'))
  })
  await wrapped(context)
  expect(mockRpc.invocations).toEqual([['Layout.handleActiveEditorChange', 'file:///two.txt']])
})
