import { expect, test } from '@jest/globals'
import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeAllAndSave } from '../src/parts/CloseAllAndSave/CloseAllAndSave.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeAllAndSave should keep a dirty editor open when closing is canceled', async () => {
  using rendererRpc = RendererWorker.registerMockRpc({})
  using dialogRpc = DialogWorker.registerMockRpc({
    'ConfirmPrompt.prompt3': async () => 'cancel',
  })
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorUid: 101,
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              title: 'dirty.txt',
              uri: 'file:///dirty.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await closeAllAndSave(state)

  expect(result).toBe(state)
  expect(rendererRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt3',
      'Do you want to save the changes you made to dirty.txt?',
      {
        cancelMessage: 'Cancel',
        confirmMessage: 'Save',
        discardMessage: "Don't Save",
        discardPrompt: 'Discard the changes you made to dirty.txt?',
        title: 'Save Changes',
      },
    ],
  ])
  expect(dialogRpc.invocations).toEqual(rendererRpc.invocations)
})
