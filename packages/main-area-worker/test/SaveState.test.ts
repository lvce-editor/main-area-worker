import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { SavedState } from '../src/parts/SavedState/SavedState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { saveState } from '../src/parts/SaveState/SaveState.ts'

test('saveState should save layout from default state', () => {
  const state: MainAreaState = createDefaultState()
  const result: SavedState = saveState(state)
  expect(result.layout).toEqual(state.layout)
  expect(result.layout.activeGroupId).toBe('0')
  expect(result.layout.direction).toBe('horizontal')
  expect(result.layout.groups).toEqual([])
})

test('saveState should save layout with custom configuration', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'test content',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'Test File',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout).toEqual(state.layout)
  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.groups).toHaveLength(1)
})

test('saveState should only save layout, not other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/custom/path',
    disposed: true,
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 5,
    uid: 999,
  }
  const result: SavedState = saveState(state)
  expect(result.layout).toEqual(state.layout)
  expect((result as any).assetDir).toBeUndefined()
  expect((result as any).disposed).toBeUndefined()
  expect((result as any).platform).toBeUndefined()
  expect((result as any).uid).toBeUndefined()
})

test('saveState should save layout with multiple groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File 1',
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
              content: 'content2',
              editorType: 'text',
              id: 2,
              isDirty: true,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[1].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('File 1')
  expect(result.layout.groups[1].tabs[0].title).toBe('File 2')
})

test('saveState should save layout with custom editor tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
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
              editorType: 'custom',
              id: 1,
              isDirty: false,
              title: 'Custom Editor',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups[0].tabs[0].editorType).toBe('custom')
  expect(result.layout.groups[0].tabs[0].customEditorId).toBe('custom-editor-1')
})

test('saveState should save layout with tabs containing paths and languages', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'console.log("hello");',
              editorType: 'text',
              id: 1,
              isDirty: false,
              language: 'javascript',
              path: '/path/to/script.js',
              title: 'script.js',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups[0].tabs[0].path).toBe('/path/to/script.js')
  expect(result.layout.groups[0].tabs[0].language).toBe('javascript')
})

test('saveState should save layout with undefined activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result.layout.groups).toHaveLength(0)
})

test('saveState should save layout with empty groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
})

test('saveState should return a new object, not mutate the original state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
  }
  const result: SavedState = saveState(state)
  expect(result).not.toBe(state)
  expect(result.layout).toBe(state.layout)
})

test('saveState should save layout with string activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 'group-1',
      direction: 'vertical',
      groups: [
        {
          activeTabId: 'tab-1',
          focused: true,
          id: 'group-1',
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 'tab-1',
              isDirty: false,
              title: 'Tab',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.activeGroupId).toBe('group-1')
  expect(result.layout.groups[0].id).toBe('group-1')
  expect(result.layout.groups[0].activeTabId).toBe('tab-1')
  expect(result.layout.groups[0].tabs[0].id).toBe('tab-1')
})
