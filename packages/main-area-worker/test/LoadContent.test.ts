import { expect, test } from '@jest/globals'
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
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'restored content',
              editorType: 'text' as const,
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
      direction: 'vertical' as const,
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text' as const,
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
          size: 50,
          tabs: [
            {
              content: 'content2',
              editorType: 'text' as const,
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
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 2,
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
              title: 'Tab 1',
            },
            {
              content: 'content2',
              editorType: 'text' as const,
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'Tab 2',
            },
            {
              content: 'content3',
              editorType: 'text' as const,
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
      direction: 'horizontal' as const,
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
      direction: 'horizontal' as const,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'custom content',
              customEditorId: 'custom-editor-1',
              editorType: 'custom' as const,
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
  expect(result.layout.groups[0].tabs[0].customEditorId).toBe('custom-editor-1')
})

test('loadContent should restore layout with tabs containing paths', async () => {
  const state = createDefaultState()
  const savedState = {
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
              content: 'console.log("hello");',
              editorType: 'text' as const,
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
