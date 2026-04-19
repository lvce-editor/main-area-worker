import { expect, test } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleIconThemeChange } from '../src/parts/HandleIconThemeChange/HandleIconThemeChange.ts'

test('handleIconThemeChange should reload icons for restored tabs', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript'],
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
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
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleIconThemeChange(state)

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'script.ts', type: 1 }]]])
  expect(result.layout.groups[0].tabs[0].icon).toBe('file-icon-typescript')
  expect(result.fileIconCache).toEqual({
    '/path/to/script.ts': 'file-icon-typescript',
  })
})

test('handleIconThemeChange should ignore stale icon cache and refetch icons', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-new'],
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {
      '/path/to/script.ts': 'file-icon-old',
    },
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
              icon: 'file-icon-old',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await handleIconThemeChange(state)

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'script.ts', type: 1 }]]])
  expect(result.layout.groups[0].tabs[0].icon).toBe('file-icon-new')
  expect(result.fileIconCache).toEqual({
    '/path/to/script.ts': 'file-icon-new',
  })
})
