import { expect, test } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { loadFileIcons } from '../src/parts/LoadContent/LoadFileIcons.ts'

test('loadFileIcons should load icons for all tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              title: 'file1.ts',
              uri: 'file:///file1.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file2.js',
              uri: 'file:///file2.js',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['icon-ts', 'icon-js'],
  })

  const { fileIconCache, updatedLayout } = await loadFileIcons(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
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
            icon: 'icon-ts',
            id: 1,
            isDirty: false,
            title: 'file1.ts',
            uri: 'file:///file1.ts',
          },
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-js',
            id: 2,
            isDirty: false,
            title: 'file2.js',
            uri: 'file:///file2.js',
          },
        ],
      },
    ],
  }

  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'file1.ts', type: 1 },
        { name: 'file2.js', type: 1 },
      ],
    ],
  ])
  expect(updatedLayout).toEqual(expectedLayout)
  expect(fileIconCache).toEqual({
    'file:///file1.ts': 'icon-ts',
    'file:///file2.js': 'icon-js',
  })
})

test('loadFileIcons should handle empty tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => [],
  })

  const { fileIconCache, updatedLayout } = await loadFileIcons(state)

  const expectedLayout = {
    activeGroupId: undefined,
    direction: 'horizontal',
    groups: [],
  }

  expect(mockRpc.invocations).toEqual([])
  expect(updatedLayout).toEqual(expectedLayout)
  expect(fileIconCache).toEqual({})
})

test('loadFileIcons should update only relevant tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.ts',
              uri: 'file:///file1.ts',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file2.js',
              uri: 'file:///file2.js',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['icon-ts', 'icon-js'],
  })

  const { updatedLayout } = await loadFileIcons(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        isEmpty: false,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-ts',
            id: 1,
            isDirty: false,
            title: 'file1.ts',
            uri: 'file:///file1.ts',
          },
        ],
      },
      {
        activeTabId: 2,
        focused: false,
        id: 2,
        isEmpty: false,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-js',
            id: 2,
            isDirty: false,
            title: 'file2.js',
            uri: 'file:///file2.js',
          },
        ],
      },
    ],
  }

  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'file1.ts', type: 1 },
        { name: 'file2.js', type: 1 },
      ],
    ],
  ])
  expect(updatedLayout).toEqual(expectedLayout)
})

test('loadFileIcons should preserve other tab properties', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              editorUid: 42,
              icon: 'old-icon',
              id: 99,
              isDirty: true,
              title: 'Important File',
              uri: 'file:///important.ts',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['new-icon'],
  })

  const { updatedLayout } = await loadFileIcons(state)
  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
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
            editorUid: 42,
            icon: 'new-icon',
            id: 99,
            isDirty: true,
            title: 'Important File',
            uri: 'file:///important.ts',
          },
        ],
      },
    ],
  }

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'important.ts', type: 1 }]]])
  expect(updatedLayout).toEqual(expectedLayout)
})

test('loadFileIcons should handle missing icons gracefully', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              title: 'unknown.xyz',
              uri: 'file:///unknown.xyz',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => [],
  })

  const { updatedLayout } = await loadFileIcons(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
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
            icon: undefined,
            id: 1,
            isDirty: false,
            title: 'unknown.xyz',
            uri: 'file:///unknown.xyz',
          },
        ],
      },
    ],
  }

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'unknown.xyz', type: 1 }]]])
  expect(updatedLayout).toEqual(expectedLayout)
})

test('loadFileIcons should handle error and return original state', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: { 'file:///cached.ts': 'cached-icon' },
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              title: 'file.ts',
              uri: 'file:///file.ts',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      throw new Error('Icon theme error')
    },
  })

  const { fileIconCache, updatedLayout } = await loadFileIcons(state)

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'file.ts', type: 1 }]]])
  expect(fileIconCache).toEqual(state.fileIconCache)
  expect(updatedLayout).toEqual(state.layout)
})

test('loadFileIcons should handle multiple groups with multiple tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 33,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'f1.ts',
              uri: 'file:///f1.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'f2.js',
              uri: 'file:///f2.js',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 33,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'f3.json',
              uri: 'file:///f3.json',
            },
          ],
        },
        {
          activeTabId: 4,
          focused: false,
          id: 3,
          isEmpty: false,
          size: 34,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: true,
              title: 'f4.css',
              uri: 'file:///f4.css',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'f5.html',
              uri: 'file:///f5.html',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['icon-ts', 'icon-js', 'icon-json', 'icon-css', 'icon-html'],
  })

  const { updatedLayout } = await loadFileIcons(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'vertical',
    groups: [
      {
        activeTabId: 1,
        focused: true,
        id: 1,
        isEmpty: false,
        size: 33,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-ts',
            id: 1,
            isDirty: false,
            title: 'f1.ts',
            uri: 'file:///f1.ts',
          },
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-js',
            id: 2,
            isDirty: false,
            title: 'f2.js',
            uri: 'file:///f2.js',
          },
        ],
      },
      {
        activeTabId: 3,
        focused: false,
        id: 2,
        isEmpty: false,
        size: 33,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-json',
            id: 3,
            isDirty: false,
            title: 'f3.json',
            uri: 'file:///f3.json',
          },
        ],
      },
      {
        activeTabId: 4,
        focused: false,
        id: 3,
        isEmpty: false,
        size: 34,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-css',
            id: 4,
            isDirty: true,
            title: 'f4.css',
            uri: 'file:///f4.css',
          },
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-html',
            id: 5,
            isDirty: false,
            title: 'f5.html',
            uri: 'file:///f5.html',
          },
        ],
      },
    ],
  }

  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'f1.ts', type: 1 },
        { name: 'f2.js', type: 1 },
        { name: 'f3.json', type: 1 },
        { name: 'f4.css', type: 1 },
        { name: 'f5.html', type: 1 },
      ],
    ],
  ])
  expect(updatedLayout).toEqual(expectedLayout)
})

test('loadFileIcons should preserve group structure', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 2,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'f1.ts',
              uri: 'file:///f1.ts',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'f2.js',
              uri: 'file:///f2.js',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['icon-ts', 'icon-js'],
  })

  const { updatedLayout } = await loadFileIcons(state)

  const expectedLayout = {
    activeGroupId: 2,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 1,
        focused: false,
        id: 1,
        isEmpty: false,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-ts',
            id: 1,
            isDirty: false,
            title: 'f1.ts',
            uri: 'file:///f1.ts',
          },
        ],
      },
      {
        activeTabId: 2,
        focused: true,
        id: 1,
        isEmpty: false,
        size: 50,
        tabs: [
          {
            editorType: 'text',
            editorUid: -1,
            icon: 'icon-js',
            id: 2,
            isDirty: false,
            title: 'f2.js',
            uri: 'file:///f2.js',
          },
        ],
      },
    ],
  }

  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'f1.ts', type: 1 },
        { name: 'f2.js', type: 1 },
      ],
    ],
  ])
  expect(updatedLayout).toEqual(expectedLayout)
})

test('loadFileIcons should handle tabs with empty uri', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              title: 'Untitled',
            },
          ],
        },
      ],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => [],
  })

  const { updatedLayout } = await loadFileIcons(state)

  const expectedLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
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
            icon: undefined,
            id: 1,
            isDirty: false,
            title: 'Untitled',
          },
        ],
      },
    ],
  }

  expect(mockRpc.invocations).toEqual([])
  expect(updatedLayout).toEqual(expectedLayout)
})
