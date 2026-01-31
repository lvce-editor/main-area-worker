import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeTabsRight } from '../src/parts/CloseTabsRight/CloseTabsRight.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('closeTabsRight should close all tabs to the right of the active tab', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
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
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].tabs[1].id).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result).not.toBe(state)
})

test('closeTabsRight should return state unchanged when group does not exist', () => {
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
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 999)

  expect(result).toBe(state)
})

test('closeTabsRight should return state unchanged when there is no active tab', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
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
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result).toBe(state)
})

test('closeTabsRight should return state unchanged when active tab is at the end', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 3,
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
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result).toBe(state)
})

test('closeTabsRight should preserve other groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
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
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
        {
          activeTabId: 5,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 6,
              isDirty: false,
              title: 'File 6',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].tabs[1].id).toBe(2)
  expect(result.layout.groups[1].tabs.length).toBe(3)
  expect(result.layout.groups[1].tabs[0].id).toBe(4)
  expect(result.layout.groups[1].tabs[1].id).toBe(5)
  expect(result.layout.groups[1].tabs[2].id).toBe(6)
})

test('closeTabsRight should handle single tab in group', () => {
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
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result).toBe(state)
})

test('closeTabsRight should handle active tab at the beginning', () => {
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
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeTabsRight should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/test',
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
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
    platform: 1,
    uid: 123,
  }

  const result = closeTabsRight(state, 1)

  expect(result.assetDir).toBe('/test')
  expect(result.platform).toBe(1)
  expect(result.uid).toBe(123)
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.direction).toBe('horizontal')
})

test('closeTabsRight should handle tabs with custom properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
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
              isDirty: true,
              language: 'typescript',
              title: 'File 1',
              uri: '/file1.ts',
            },
            {
              editorType: 'custom',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              language: 'javascript',
              title: 'File 2',
              uri: '/file2.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(result.layout.groups[0].tabs[0].language).toBe('typescript')
  expect(result.layout.groups[0].tabs[0].uri).toBe('/file1.ts')
  expect(result.layout.groups[0].tabs[1].id).toBe(2)
  expect(result.layout.groups[0].tabs[1].editorType).toBe('custom')
})

test('closeTabsRight should close tabs in second group when specified', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
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
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 4,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 2)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[1].tabs.length).toBe(2)
  expect(result.layout.groups[1].tabs[0].id).toBe(3)
  expect(result.layout.groups[1].tabs[1].id).toBe(4)
})

test('closeTabsRight should return state unchanged when active tab id not found in tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 999,
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
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result).toBe(state)
})

test('closeTabsRight should close multiple tabs to the right', () => {
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
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
})

test('closeTabsRight should handle empty groups array', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result).toBe(state)
})

test('closeTabsRight should preserve group properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          direction: 'vertical',
          focused: true,
          id: 1,
          isEmpty: false,
          size: 75,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].focused).toBe(true)
  expect(result.layout.groups[0].size).toBe(75)
  expect(result.layout.groups[0].direction).toBe('vertical')
  expect(result.layout.groups[0].id).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('closeTabsRight should handle active tab in the middle', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 3,
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
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 4,
              isDirty: false,
              title: 'File 4',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 5,
              isDirty: false,
              title: 'File 5',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(3)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
  expect(result.layout.groups[0].tabs[1].id).toBe(2)
  expect(result.layout.groups[0].tabs[2].id).toBe(3)
})

test('closeTabsRight should preserve dirty tabs to the left', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
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
              isDirty: true,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 3,
              isDirty: true,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs[0].isDirty).toBe(true)
  expect(result.layout.groups[0].tabs[1].isDirty).toBe(false)
})

test('closeTabsRight should handle vertical layout direction', () => {
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
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.groups[0].tabs.length).toBe(1)
})

test('closeTabsRight should handle two tabs with one to close', () => {
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
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  const result = closeTabsRight(state, 1)

  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].id).toBe(1)
})
