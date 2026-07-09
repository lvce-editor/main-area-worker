import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { moveIntoNewWindow } from '../src/parts/MoveIntoNewWindow/MoveIntoNewWindow.ts'

test('moveIntoNewWindow should open active tab in new window and close it', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ElectronWindow.openNewWithUri': async () => {},
  })
  const state: MainAreaState = {
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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
              uri: '/workspace/file.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await moveIntoNewWindow(state)

  expect(mockRpc.invocations).toEqual([['ElectronWindow.openNewWithUri', '/workspace/file.txt']])
  expect(result.layout.groups).toEqual([])
})

test('moveIntoNewWindow should do nothing when active tab has no uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ElectronWindow.openNewWithUri': async () => {},
  })
  const state: MainAreaState = {
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
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'Untitled',
            },
          ],
        },
      ],
    },
  }

  const result = await moveIntoNewWindow(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})
