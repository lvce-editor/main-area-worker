import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { SavedState } from '../src/parts/SavedState/SavedState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { saveState } from '../src/parts/SaveState/SaveState.ts'

test('saveState should save layout from default state', () => {
  const state: MainAreaState = createDefaultState()
  const result: SavedState = saveState(state)
  expect(result.layout).toEqual(state.layout)
  expect(result.layout.activeGroupId).toBeUndefined()
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
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
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
  expect(result.layout.direction).toEqual(state.layout.direction)
  expect(result.layout.groups).toEqual(state.layout.groups)
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
  const result: SavedState = saveState(state)
  expect(result.layout.groups[0].tabs[0].editorType).toBe('custom')
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
  const result: SavedState = saveState(state)
  expect(result.layout.groups[0].tabs[0].uri).toBe('/path/to/script.ts')
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
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
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
test('saveState should filter out untitled editors from tabs', () => {
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
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
              uri: '/path/to/file1.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              title: 'Untitled 1',
              uri: 'untitled://1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 2',
              uri: '/path/to/file2.ts',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(2)
  expect(result.layout.groups[0].tabs[0].title).toBe('File 1')
  expect(result.layout.groups[0].tabs[1].title).toBe('File 2')
})

test('saveState should remove groups that become empty after filtering untitled editors', () => {
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
              uri: '/path/to/file1.ts',
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
              isDirty: true,
              title: 'Untitled 1',
              uri: 'untitled://1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: true,
              title: 'Untitled 2',
              uri: 'untitled://2',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('File 1')
})

test('saveState should set activeGroupId to undefined if active group is removed due to being empty', () => {
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
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: true,
              title: 'Untitled 1',
              uri: 'untitled://1',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(0)
  expect(result.layout.activeGroupId).toBeUndefined()
})

test('saveState should preserve activeGroupId if active group still has tabs after filtering', () => {
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
              uri: '/path/to/file1.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              title: 'Untitled 1',
              uri: 'untitled://1',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 2',
              uri: '/path/to/file2.ts',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('File 1')
})

test('saveState should handle complex scenario with multiple groups and mixed tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: false,
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
              title: 'Untitled A',
              uri: 'untitled://a',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'Untitled B',
              uri: 'untitled://b',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 34,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File A',
              uri: '/path/to/fileA.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: true,
              title: 'Untitled C',
              uri: 'untitled://c',
            },
          ],
        },
        {
          activeTabId: 5,
          focused: false,
          id: 3,
          isEmpty: false,
          size: 33,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File B',
              uri: '/path/to/fileB.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 6,
              isDirty: false,
              title: 'File C',
              uri: '/path/to/fileC.ts',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].id).toBe(2)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('File A')
  expect(result.layout.groups[1].id).toBe(3)
  expect(result.layout.groups[1].tabs).toHaveLength(2)
  expect(result.layout.activeGroupId).toBe(2)
})
