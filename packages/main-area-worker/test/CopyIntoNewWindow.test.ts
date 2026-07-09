import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { copyIntoNewWindow } from '../src/parts/CopyIntoNewWindow/CopyIntoNewWindow.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

test('copyIntoNewWindow should open active tab in new window and keep it open', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ElectronWindow.openNewWithUri': async () => {},
  })
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: LayoutDirection.Horizontal,
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
              uri: '/workspace/file.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await copyIntoNewWindow(state)

  expect(mockRpc.invocations).toEqual([['ElectronWindow.openNewWithUri', '/workspace/file.txt']])
  expect(result).toBe(state)
})

test('copyIntoNewWindow should do nothing when active tab has no uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ElectronWindow.openNewWithUri': async () => {},
  })
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: LayoutDirection.Horizontal,
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
            },
          ],
        },
      ],
    },
  }

  const result = await copyIntoNewWindow(state)

  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
})
