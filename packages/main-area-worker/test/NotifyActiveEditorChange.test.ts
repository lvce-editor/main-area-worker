import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { notifyActiveEditorChange } from '../src/parts/NotifyActiveEditorChange/NotifyActiveEditorChange.ts'

const createState = (uri: string, type: 'editor' | 'image' = 'editor'): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: uri ? 1 : -1,
        direction: 1,
        id: 1,
        isEmpty: !uri,
        isFocused: true,
        size: 100,
        tabs: uri
          ? [
              {
                editorInput: {
                  type,
                  uri,
                },
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

test('notifies loaded viewlets when the active file changes', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleActiveEditorChange': () => undefined,
  })
  await notifyActiveEditorChange(createState('file:///one.txt'), createState('file:///two.txt'))
  expect(mockRpc.invocations).toEqual([['Layout.handleActiveEditorChange', 'file:///two.txt', true]])
})

test('notifies loaded viewlets with an empty uri after the last editor closes', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleActiveEditorChange': () => undefined,
  })
  await notifyActiveEditorChange(createState('file:///one.txt'), createState(''))
  expect(mockRpc.invocations).toEqual([['Layout.handleActiveEditorChange', '', false]])
})

test('does not notify viewlets when the active file is unchanged', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleActiveEditorChange': () => undefined,
  })
  await notifyActiveEditorChange(createState('file:///one.txt'), createState('file:///one.txt'))
  expect(mockRpc.invocations).toEqual([])
})

test('notifies viewlets when the active editor type changes for the same uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleActiveEditorChange': () => undefined,
  })
  await notifyActiveEditorChange(createState('file:///image.png', 'editor'), createState('file:///image.png', 'image'))
  expect(mockRpc.invocations).toEqual([['Layout.handleActiveEditorChange', 'file:///image.png', false]])
})

test('does not fail the editor command when viewlets cannot receive the notification', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.handleActiveEditorChange': () => {
      throw new Error('command unavailable')
    },
  })
  await expect(notifyActiveEditorChange(createState('file:///one.txt'), createState('file:///two.txt'))).resolves.toBeUndefined()
  expect(warn).toHaveBeenCalledTimes(1)
  warn.mockRestore()
  expect(mockRpc.invocations).toHaveLength(1)
})
