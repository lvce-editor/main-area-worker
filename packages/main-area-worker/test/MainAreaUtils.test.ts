import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab, EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultMainAreaState } from '../src/parts/CreateDefaultMainAreaState/CreateDefaultMainAreaState.ts'
import * as MainAreaUtils from '../src/parts/MainAreaUtils/MainAreaUtils.ts'

test('isValidTab should return true for valid text tab', () => {
  const tab: Tab = {
    content: 'content',
    editorType: 'text',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(true)
})

test('isValidTab should return true for valid custom tab', () => {
  const tab: Tab = {
    content: 'content',
    customEditorId: 'custom-editor-1',
    editorType: 'custom',
    id: 1,
    isDirty: false,
    title: 'Custom File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(true)
})

test('isValidTab should return false for null', () => {
  expect(MainAreaUtils.isValidTab(null)).toBeFalsy()
})

test('isValidTab should return false for undefined', () => {
  expect(MainAreaUtils.isValidTab(undefined)).toBeFalsy()
})

test('isValidTab should return false for missing id', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid id type', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
    id: '1',
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing title', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
    id: 1,
    isDirty: false,
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid title type', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
    id: 1,
    isDirty: false,
    title: 123,
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing content', () => {
  const tab = {
    editorType: 'text',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid content type', () => {
  const tab = {
    content: 123,
    editorType: 'text',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing isDirty', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
    id: 1,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid isDirty type', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
    id: 1,
    isDirty: 'true',
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid editorType', () => {
  const tab = {
    content: 'content',
    editorType: 'invalid',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for custom tab without customEditorId', () => {
  const tab = {
    content: 'content',
    editorType: 'custom',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for custom tab with invalid customEditorId type', () => {
  const tab = {
    content: 'content',
    customEditorId: 123,
    editorType: 'custom',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(MainAreaUtils.isValidTab(tab)).toBe(false)
})

test('isValidEditorGroup should return true for valid group', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
    id: 1,
    size: 50,
    tabs: [
      {
        content: 'content',
        editorType: 'text',
        id: 1,
        isDirty: false,
        title: 'File',
      },
    ],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(true)
})

test('isValidEditorGroup should return true for group with undefined activeTabId', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(true)
})

test('isValidEditorGroup should return false for null', () => {
  expect(MainAreaUtils.isValidEditorGroup(null)).toBeFalsy()
})

test('isValidEditorGroup should return false for undefined', () => {
  expect(MainAreaUtils.isValidEditorGroup(undefined)).toBeFalsy()
})

test('isValidEditorGroup should return false for missing id', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    size: 50,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid id type', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: '1',
    size: 50,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for missing tabs', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: 50,
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid tabs type', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: 50,
    tabs: 'not an array',
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for tabs with invalid tab', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: 50,
    tabs: [
      {
        content: 'content',
        editorType: 'text',
        id: '1',
        isDirty: false,
        title: 'File',
      },
    ],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid activeTabId type', () => {
  const group = {
    activeTabId: '1',
    focused: true,
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for missing focused', () => {
  const group = {
    activeTabId: undefined,
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid focused type', () => {
  const group = {
    activeTabId: undefined,
    focused: 'true',
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for missing size', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid size type', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: '50',
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for size zero', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: 0,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for negative size', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: -10,
    tabs: [],
  }
  expect(MainAreaUtils.isValidEditorGroup(group)).toBe(false)
})

test('findGroupById should return group when found', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 50,
          tabs: [],
        },
      ],
    },
  }
  const result = MainAreaUtils.findGroupById(state, 2)
  expect(result).toBeDefined()
  expect(result?.id).toBe(2)
})

test('findGroupById should return undefined when not found', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = MainAreaUtils.findGroupById(state, 999)
  expect(result).toBeUndefined()
})

test('findTabById should return tab and groupId when found', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.findTabById(state, 2)
  expect(result).toBeDefined()
  expect(result?.tab.id).toBe(2)
  expect(result?.groupId).toBe(2)
})

test('findTabById should return undefined when not found', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.findTabById(state, 999)
  expect(result).toBeUndefined()
})

test('getActiveTab should return active tab when group is focused and has activeTabId', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
            {
              content: 'content2',
              editorType: 'text',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'content3',
              editorType: 'text',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.getActiveTab(state)
  expect(result).toBeDefined()
  expect(result?.tab.id).toBe(1)
  expect(result?.groupId).toBe(1)
})

test('getActiveTab should return undefined when no group is focused', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.getActiveTab(state)
  expect(result).toBeUndefined()
})

test('getActiveTab should return undefined when focused group has no activeTabId', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = MainAreaUtils.getActiveTab(state)
  expect(result).toBeUndefined()
})

test('getActiveTab should return undefined when activeTabId does not match any tab', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 999,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.getActiveTab(state)
  expect(result).toBeUndefined()
})

test('getAllTabs should return all tabs from all groups', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
            {
              content: 'content2',
              editorType: 'text',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'content3',
              editorType: 'text',
              id: 3,
              isDirty: false,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.getAllTabs(state)
  expect(result).toHaveLength(3)
  expect(result[0].id).toBe(1)
  expect(result[1].id).toBe(2)
  expect(result[2].id).toBe(3)
})

test('getAllTabs should return empty array when no tabs exist', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result = MainAreaUtils.getAllTabs(state)
  expect(result).toHaveLength(0)
})

test('getDirtyTabs should return only dirty tabs', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
              isDirty: true,
              title: 'File 1',
            },
            {
              content: 'content2',
              editorType: 'text',
              id: 2,
              isDirty: false,
              title: 'File 2',
            },
          ],
        },
        {
          activeTabId: 3,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'content3',
              editorType: 'text',
              id: 3,
              isDirty: true,
              title: 'File 3',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.getDirtyTabs(state)
  expect(result).toHaveLength(2)
  expect(result[0].id).toBe(1)
  expect(result[1].id).toBe(3)
})

test('getDirtyTabs should return empty array when no dirty tabs exist', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.getDirtyTabs(state)
  expect(result).toHaveLength(0)
})

test('hasDirtyTabs should return true when dirty tabs exist', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: true,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.hasDirtyTabs(state)
  expect(result).toBe(true)
})

test('hasDirtyTabs should return false when no dirty tabs exist', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
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
              content: 'content',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = MainAreaUtils.hasDirtyTabs(state)
  expect(result).toBe(false)
})

test('getGroupIndex should return correct index when group exists', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          size: 33,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 3,
          size: 34,
          tabs: [],
        },
      ],
    },
  }
  expect(MainAreaUtils.getGroupIndex(state, 1)).toBe(0)
  expect(MainAreaUtils.getGroupIndex(state, 2)).toBe(1)
  expect(MainAreaUtils.getGroupIndex(state, 3)).toBe(2)
})

test('getGroupIndex should return -1 when group does not exist', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  expect(MainAreaUtils.getGroupIndex(state, 999)).toBe(-1)
})

test('getTabIndex should return correct index when tab exists', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
    id: 1,
    size: 100,
    tabs: [
      {
        content: 'content1',
        editorType: 'text',
        id: 1,
        isDirty: false,
        title: 'File 1',
      },
      {
        content: 'content2',
        editorType: 'text',
        id: 2,
        isDirty: false,
        title: 'File 2',
      },
      {
        content: 'content3',
        editorType: 'text',
        id: 3,
        isDirty: false,
        title: 'File 3',
      },
    ],
  }
  expect(MainAreaUtils.getTabIndex(group, 1)).toBe(0)
  expect(MainAreaUtils.getTabIndex(group, 2)).toBe(1)
  expect(MainAreaUtils.getTabIndex(group, 3)).toBe(2)
})

test('getTabIndex should return -1 when tab does not exist', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
    id: 1,
    size: 100,
    tabs: [
      {
        content: 'content',
        editorType: 'text',
        id: 1,
        isDirty: false,
        title: 'File',
      },
    ],
  }
  expect(MainAreaUtils.getTabIndex(group, 999)).toBe(-1)
})

test('normalizeGroupSizes should normalize sizes to percentages', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: undefined,
      focused: true,
      id: 1,
      size: 30,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
      size: 70,
      tabs: [],
    },
  ]
  const result = MainAreaUtils.normalizeGroupSizes(groups)
  expect(result[0].size).toBe(30)
  expect(result[1].size).toBe(70)
})

test('normalizeGroupSizes should normalize when total is not 100', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: undefined,
      focused: true,
      id: 1,
      size: 20,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
      size: 30,
      tabs: [],
    },
  ]
  const result = MainAreaUtils.normalizeGroupSizes(groups)
  expect(result[0].size).toBe(40)
  expect(result[1].size).toBe(60)
})

test('normalizeGroupSizes should handle zero total by distributing equally', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: undefined,
      focused: true,
      id: 1,
      size: 0,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
      size: 0,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 3,
      size: 0,
      tabs: [],
    },
  ]
  const result = MainAreaUtils.normalizeGroupSizes(groups)
  const total = result[0].size + result[1].size + result[2].size
  expect(total).toBeGreaterThanOrEqual(99)
  expect(total).toBeLessThanOrEqual(100)
  expect(result[0].size).toBeGreaterThanOrEqual(33)
  expect(result[1].size).toBeGreaterThanOrEqual(33)
  expect(result[2].size).toBeGreaterThanOrEqual(33)
})

test('normalizeGroupSizes should preserve other group properties', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: 1,
      focused: true,
      id: 1,
      size: 50,
      tabs: [
        {
          content: 'content',
          editorType: 'text',
          id: 1,
          isDirty: false,
          title: 'File',
        },
      ],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
      size: 50,
      tabs: [],
    },
  ]
  const result = MainAreaUtils.normalizeGroupSizes(groups)
  expect(result[0].id).toBe(1)
  expect(result[0].focused).toBe(true)
  expect(result[0].activeTabId).toBe(1)
  expect(result[0].tabs).toHaveLength(1)
  expect(result[1].id).toBe(2)
  expect(result[1].focused).toBe(false)
})

test('validateMainAreaState should return true for valid state', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(true)
})

test('validateMainAreaState should return true for state with activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(true)
})

test('validateMainAreaState should return true for state with undefined activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultMainAreaState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(true)
})

test('validateMainAreaState should return false for null', () => {
  expect(MainAreaUtils.validateMainAreaState(null)).toBeFalsy()
})

test('validateMainAreaState should return false for undefined', () => {
  expect(MainAreaUtils.validateMainAreaState(undefined)).toBeFalsy()
})

test('validateMainAreaState should return false for missing assetDir', () => {
  const state = {
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid assetDir type', () => {
  const state = {
    assetDir: 123,
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for missing platform', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid platform type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: '0',
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for missing layout', () => {
  const state = {
    assetDir: '',
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBeFalsy()
})

test('validateMainAreaState should return false for missing groups', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
    },
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid groups type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: 'not an array',
    },
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for groups with invalid group', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: '1',
          size: 100,
          tabs: [],
        },
      ],
    },
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid activeGroupId type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: '1',
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid direction', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'diagonal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for missing uid', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})

test('validateMainAreaState should return false for invalid uid type', () => {
  const state = {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: '0',
  }
  expect(MainAreaUtils.validateMainAreaState(state)).toBe(false)
})
