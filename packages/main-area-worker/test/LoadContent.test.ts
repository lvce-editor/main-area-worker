import { expect, test } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should return empty layout when savedState is undefined', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state, undefined)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result.layout.direction).toBe('horizontal')
})

test('loadContent should return empty layout when savedState is null', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state, null)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should return empty layout when savedState is invalid object', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state, { invalid: 'data' })

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should return empty layout when savedState.layout is invalid', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state, { layout: 'not an object' })

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should restore valid saved state', async () => {
  const state = createDefaultState()
  const savedState = {
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
              title: 'Restored File',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('Restored File')
  expect(result.layout.activeGroupId).toBe(1)
})

test('loadContent should restore layout with multiple groups', async () => {
  const state = createDefaultState()
  const savedState = {
    layout: {
      activeGroupId: 2,
      direction: 'vertical',
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
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.activeGroupId).toBe(2)
})

test('loadContent should restore layout with multiple tabs per group', async () => {
  const state = createDefaultState()
  const savedState = {
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 2,
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
              title: 'Tab 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'Tab 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'Tab 3',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups[0].tabs).toHaveLength(3)
  expect(result.layout.groups[0].activeTabId).toBe(2)
})

test('loadContent should preserve existing state properties', async () => {
  const state = {
    ...createDefaultState(),
    assetDir: '/test/assets',
    disposed: true,
    platform: 1,
    uid: 123,
  }
  const result = await LoadContent.loadContent(state, undefined)

  expect(result.uid).toBe(123)
  expect(result.disposed).toBe(true)
  expect(result.assetDir).toBe('/test/assets')
  expect(result.platform).toBe(1)
})

test('loadContent should return empty layout when savedState is a string', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state, 'invalid string')

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should return empty layout when savedState is a number', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state, 123)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should return empty layout when layout has invalid direction', async () => {
  const state = createDefaultState()
  const savedState = {
    layout: {
      activeGroupId: 1,
      direction: 'invalid',
      groups: [],
    },
  }
  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should return empty layout when layout has groups as non-array', async () => {
  const state = createDefaultState()
  const savedState = {
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: 'not an array',
    },
  }
  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should return empty layout when group has invalid structure', async () => {
  const state = createDefaultState()
  const savedState = {
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [{ invalid: 'group' }],
    },
  }
  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('loadContent should restore layout with empty groups array', async () => {
  const state = createDefaultState()
  const savedState = {
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result.layout.direction).toBe('horizontal')
})

test('loadContent should restore layout with custom editor tabs', async () => {
  const state = createDefaultState()
  const savedState = {
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
              editorType: 'custom',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'Custom Editor',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups[0].tabs[0].editorType).toBe('custom')
})

test('loadContent should restore layout with tabs containing paths', async () => {
  const state = createDefaultState()
  const savedState = {
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
              language: 'javascript',
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(result.layout.groups[0].tabs[0].uri).toBe('/path/to/script.ts')
  expect(result.layout.groups[0].tabs[0].language).toBe('javascript')
})

test('loadContent should load icon theme for tabs with uri', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript'],
  })
  void mockRpc

  const state = createDefaultState()
  const savedState = {
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
              language: 'javascript',
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'script.ts', type: 1 }]]])
  expect(result.layout.groups[0].tabs[0].icon).toBe('file-icon-typescript')
})

test('loadContent should load icons for multiple tabs', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript', 'file-icon-text'],
  })
  void mockRpc

  const state = createDefaultState()
  const savedState = {
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
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'file.txt',
              uri: '/test/file.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'script.ts', type: 1 },
        { name: 'file.txt', type: 1 },
      ],
    ],
  ])
  expect(result.layout.groups[0].tabs[0].icon).toBe('file-icon-typescript')
  expect(result.layout.groups[0].tabs[1].icon).toBe('file-icon-text')
})

test('loadContent should update fileIconCache with loaded icons', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript'],
  })
  void mockRpc

  const state = {
    ...createDefaultState(),
    fileIconCache: {},
  }
  const savedState = {
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
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'script.ts', type: 1 }]]])
  expect(result.fileIconCache['/path/to/script.ts']).toBe('file-icon-typescript')
})

test('loadContent should handle icon loading failure gracefully', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      throw new Error('Icon loading failed')
    },
  })
  void mockRpc

  const state = createDefaultState()
  const savedState = {
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
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  // Should still return valid layout even if icon loading fails
  expect(mockRpc.invocations).toEqual([['IconTheme.getIcons', [{ name: 'script.ts', type: 1 }]]])
  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('script.ts')
})

test('loadContent should load icons for tabs in multiple groups', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript', 'file-icon-text'],
  })
  void mockRpc

  const state = createDefaultState()
  const savedState = {
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
              title: 'script.ts',
              uri: '/path/to/script.ts',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
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
              title: 'file.txt',
              uri: '/test/file.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await LoadContent.loadContent(state, savedState)

  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'script.ts', type: 1 },
        { name: 'file.txt', type: 1 },
      ],
    ],
  ])
  expect(result.layout.groups[0].tabs[0].icon).toBe('file-icon-typescript')
  expect(result.layout.groups[1].tabs[0].icon).toBe('file-icon-text')
})
