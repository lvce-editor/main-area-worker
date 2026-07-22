import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { notifyActiveEditorChange } from '../src/parts/NotifyActiveEditorChange/NotifyActiveEditorChange.ts'

const createState = (uri: string): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: uri ? 1 : undefined,
        focused: true,
        id: 1,
        isEmpty: !uri,
        size: 100,
        tabs: uri
          ? [
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
            ]
          : [],
      },
    ],
  },
})

test('notifies Problems when the active file changes', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Problems.handleActiveEditorChange': () => undefined,
  })
  await notifyActiveEditorChange(createState('file:///one.txt'), createState('file:///two.txt'))
  expect(mockRpc.invocations).toEqual([['Problems.handleActiveEditorChange', 'file:///two.txt']])
})

test('notifies Problems with an empty uri after the last editor closes', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Problems.handleActiveEditorChange': () => undefined,
  })
  await notifyActiveEditorChange(createState('file:///one.txt'), createState(''))
  expect(mockRpc.invocations).toEqual([['Problems.handleActiveEditorChange', '']])
})

test('does not notify Problems when the active file is unchanged', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Problems.handleActiveEditorChange': () => undefined,
  })
  await notifyActiveEditorChange(createState('file:///one.txt'), createState('file:///one.txt'))
  expect(mockRpc.invocations).toEqual([])
})

test('does not fail the editor command when Problems cannot receive the notification', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'Problems.handleActiveEditorChange': () => {
      throw new Error('command unavailable')
    },
  })
  await expect(notifyActiveEditorChange(createState('file:///one.txt'), createState('file:///two.txt'))).resolves.toBeUndefined()
  expect(warn).toHaveBeenCalledTimes(1)
  warn.mockRestore()
  expect(mockRpc.invocations).toHaveLength(1)
})
