import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceRefresh } from '../src/parts/HandleWorkspaceRefresh/HandleWorkspaceRefresh.ts'

test('closes missing text file tabs and preserves existing tabs', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.exists': (uri: string) => uri !== '/workspace/deleted.ts',
    'Viewlet.dispose': () => {},
  })
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorInput: {
                type: 'editor' as const,
                uri: '/workspace/deleted.ts',
              },
              editorType: 'text' as const,
              editorUid: 100,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'deleted.ts',
              uri: '/workspace/deleted.ts',
            },
            {
              editorInput: {
                type: 'editor' as const,
                uri: '/workspace/existing.ts',
              },
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'existing.ts',
              uri: '/workspace/existing.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state)

  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([2])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', '/workspace/deleted.ts'],
    ['FileSystem.exists', '/workspace/existing.ts'],
    ['Viewlet.dispose', 100],
  ])
})

test('ignores non-text editor inputs', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
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
              editorInput: {
                type: 'image' as const,
                uri: '/workspace/image.png',
              },
              editorType: 'custom' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'image.png',
              uri: '/workspace/image.png',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('preserves a text file tab when checking its existence fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.exists': () => {
      throw new Error('file system unavailable')
    },
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
              editorInput: {
                type: 'editor' as const,
                uri: '/workspace/file.ts',
              },
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file.ts',
              uri: '/workspace/file.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleWorkspaceRefresh(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', '/workspace/file.ts']])
})
