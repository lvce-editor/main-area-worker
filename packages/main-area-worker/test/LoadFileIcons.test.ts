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
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'file1.ts',
              uri: 'file:///file1.ts',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => ({
      'file:///file1.ts': 'icon-ts',
      'file:///file2.js': 'icon-js',
    }),
  })

  const { fileIconCache, updatedLayout } = await loadFileIcons(state)

  expect(updatedLayout.groups[0].tabs[0].icon).toBe('icon-ts')
  expect(updatedLayout.groups[0].tabs[1].icon).toBe('icon-js')
  expect(fileIconCache['file:///file1.ts']).toBe('icon-ts')
  expect(fileIconCache['file:///file2.js']).toBe('icon-js')
})

test('loadFileIcons should handle empty tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal' as const,
      groups: [],
    },
  }

  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcons': async () => ({}),
  })

  const { fileIconCache, updatedLayout } = await loadFileIcons(state)

  expect(updatedLayout.groups).toHaveLength(0)
  expect(Object.keys(fileIconCache)).toHaveLength(0)
})

test('loadFileIcons should update only relevant tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 50,
          tabs: [
            {
              content: 'c1',
              editorType: 'text' as const,
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
          size: 50,
          tabs: [
            {
              content: 'c2',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => ({
      'file:///file1.ts': 'icon-ts',
      'file:///file2.js': 'icon-js',
    }),
  })

  const { updatedLayout } = await loadFileIcons(state)

  expect(updatedLayout.groups[0].tabs[0].icon).toBe('icon-ts')
  expect(updatedLayout.groups[1].tabs[0].icon).toBe('icon-js')
})

test('loadFileIcons should preserve other tab properties', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'some content',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => ({
      'file:///important.ts': 'new-icon',
    }),
  })

  const { updatedLayout } = await loadFileIcons(state)
  const tab = updatedLayout.groups[0].tabs[0]

  expect(tab.id).toBe(99)
  expect(tab.title).toBe('Important File')
  expect(tab.content).toBe('some content')
  expect(tab.editorType).toBe('text')
  expect(tab.editorUid).toBe(42)
  expect(tab.isDirty).toBe(true)
  expect(tab.icon).toBe('new-icon')
})

test('loadFileIcons should handle missing icons gracefully', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => ({}),
  })

  const { updatedLayout } = await loadFileIcons(state)

  expect(updatedLayout.groups[0].tabs[0].icon).toBeUndefined()
})

test('loadFileIcons should handle error and return original state', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: { 'file:///cached.ts': 'cached-icon' },
    layout: {
      activeGroupId: 1,
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => {
      throw new Error('Icon theme error')
    },
  })

  const { fileIconCache, updatedLayout } = await loadFileIcons(state)

  expect(fileIconCache).toEqual(state.fileIconCache)
  expect(updatedLayout).toEqual(state.layout)
})

test('loadFileIcons should handle multiple groups with multiple tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'vertical' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 33,
          tabs: [
            {
              content: 'c1',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'f1.ts',
              uri: 'file:///f1.ts',
            },
            {
              content: 'c2',
              editorType: 'text' as const,
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
          size: 33,
          tabs: [
            {
              content: 'c3',
              editorType: 'text' as const,
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
          size: 34,
          tabs: [
            {
              content: 'c4',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: true,
              title: 'f4.css',
              uri: 'file:///f4.css',
            },
            {
              content: 'c5',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => ({
      'file:///f1.ts': 'icon-ts',
      'file:///f2.js': 'icon-js',
      'file:///f3.json': 'icon-json',
      'file:///f4.css': 'icon-css',
      'file:///f5.html': 'icon-html',
    }),
  })

  const { updatedLayout } = await loadFileIcons(state)

  expect(updatedLayout.groups[0].tabs[0].icon).toBe('icon-ts')
  expect(updatedLayout.groups[0].tabs[1].icon).toBe('icon-js')
  expect(updatedLayout.groups[1].tabs[0].icon).toBe('icon-json')
  expect(updatedLayout.groups[2].tabs[0].icon).toBe('icon-css')
  expect(updatedLayout.groups[2].tabs[1].icon).toBe('icon-html')
})

test('loadFileIcons should preserve group structure', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 2,
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          size: 50,
          tabs: [
            {
              content: 'c1',
              editorType: 'text' as const,
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
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'c2',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => ({
      'file:///f1.ts': 'icon-ts',
      'file:///f2.js': 'icon-js',
    }),
  })

  const { updatedLayout } = await loadFileIcons(state)

  expect(updatedLayout.groups).toHaveLength(2)
  expect(updatedLayout.groups[0].id).toBe(1)
  expect(updatedLayout.groups[0].focused).toBe(false)
  expect(updatedLayout.groups[1].id).toBe(2)
  expect(updatedLayout.groups[1].focused).toBe(true)
  expect(updatedLayout.activeGroupId).toBe(2)
  expect(updatedLayout.direction).toBe('horizontal')
})

test('loadFileIcons should handle tabs with empty uri', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
    layout: {
      activeGroupId: 1,
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text' as const,
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
    'IconTheme.getFileIcons': async () => ({}),
  })

  const { updatedLayout } = await loadFileIcons(state)

  expect(updatedLayout.groups[0].tabs[0].icon).toBeUndefined()
})
