import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceRefresh } from '../src/parts/HandleWorkspaceRefresh/HandleWorkspaceRefresh.ts'

test('closes missing text file tabs and preserves existing tabs', async () => {
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
              editorUid: -1,
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

  const result = await handleWorkspaceRefresh(state, ['/workspace/deleted.ts'])

  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([2])
})

test('ignores non-text editor inputs', async () => {
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

  const result = await handleWorkspaceRefresh(state, ['/workspace/image.png'])

  expect(result).toBe(state)
})

test('preserves text file tabs when no files were deleted', async () => {
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
})
