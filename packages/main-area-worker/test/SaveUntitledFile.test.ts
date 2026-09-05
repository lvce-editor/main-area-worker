import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'

afterEach(() => {
  MainAreaStates.clear()
})

test('saving an untitled file can update its uri before the save command finishes', async () => {
  const uid = 1
  const oldUri = 'untitled:///1'
  const newUri = 'file:///tmp/file.c'
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
              editorUid: 2,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              language: 'plaintext',
              loadingState: 'loaded',
              title: 'Untitled',
              uri: oldUri,
            },
          ],
        },
      ],
    },
    uid,
  }
  MainAreaStates.set(uid, state, state)
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.handleUriChange': async () => {},
    'Editor.save': async () => {
      await commandMap['MainArea.handleUriChange'](uid, oldUri, newUri)
      return { modified: false }
    },
    'Layout.handleActiveEditorChange': async () => {},
    'Main.handleModifiedStatusChange': async () => {},
  })

  await commandMap['MainArea.save'](uid)

  const savedState = MainAreaStates.get(uid).newState
  expect(savedState.layout.groups[0].tabs[0]).toMatchObject({
    isDirty: false,
    title: 'file.c',
    uri: newUri,
  })
  expect(mockRpc.invocations).toEqual([
    ['Editor.save', 2],
    ['Editor.handleUriChange', 2, newUri],
    ['Layout.handleActiveEditorChange', newUri],
    ['Main.handleModifiedStatusChange', oldUri, false],
    ['Layout.handleActiveEditorChange', newUri],
  ])
})
