import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import { getActiveGroup } from '../src/parts/GetActiveGroup/GetActiveGroup.ts'

test('GetActiveGroup should return group when found by ID', () => {
  const groups: EditorGroup[] = [
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
          isPreview: false,
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
          isDirty: false,
          isPreview: false,
          title: 'File 2',
        },
      ],
    },
  ]

  const result = getActiveGroup(groups, 2)
  expect(result).toBeDefined()
  expect(result?.id).toBe(2)
  expect(result?.focused).toBe(true)
})

test('GetActiveGroup should return undefined when group not found', () => {
  const groups: EditorGroup[] = [
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
          title: 'File 1',
        },
      ],
    },
  ]

  const result = getActiveGroup(groups, 999)
  expect(result).toBeUndefined()
})

test('GetActiveGroup should return first matching group by ID', () => {
  const groups: EditorGroup[] = [
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
          isPreview: false,
          title: 'File 1',
        },
      ],
    },
    {
      activeTabId: 3,
      focused: false,
      id: 3,
      isEmpty: false,
      size: 50,
      tabs: [
        {
          editorType: 'text',
          editorUid: -1,
          icon: '',
          id: 3,
          isDirty: false,
          isPreview: false,
          title: 'File 3',
        },
      ],
    },
  ]

  const result = getActiveGroup(groups, 1)
  expect(result).toBeDefined()
  expect(result?.id).toBe(1)
})

test('GetActiveGroup should return undefined for empty groups array', () => {
  const groups: EditorGroup[] = []

  const result = getActiveGroup(groups, 1)
  expect(result).toBeUndefined()
})

test('GetActiveGroup should return group with zero ID', () => {
  const groups: EditorGroup[] = [
    {
      activeTabId: undefined,
      focused: true,
      id: 0,
      isEmpty: true,
      size: 100,
      tabs: [],
    },
  ]

  const result = getActiveGroup(groups, 0)
  expect(result).toBeDefined()
  expect(result?.id).toBe(0)
})

test('GetActiveGroup should return group from array with multiple tabs', () => {
  const groups: EditorGroup[] = [
    {
      activeTabId: 2,
      focused: false,
      id: 1,
      isEmpty: false,
      size: 100,
      tabs: [
        {
          editorType: 'text',
          editorUid: 1,
          icon: 'file-icon',
          id: 1,
          isDirty: true,
          isPreview: false,
          title: 'File 1',
        },
        {
          editorType: 'text',
          editorUid: 2,
          icon: 'file-icon',
          id: 2,
          isDirty: false,
          isPreview: false,
          title: 'File 2',
        },
        {
          editorType: 'text',
          editorUid: 3,
          icon: 'file-icon',
          id: 3,
          isDirty: false,
          isPreview: false,
          title: 'File 3',
        },
      ],
    },
  ]

  const result = getActiveGroup(groups, 1)
  expect(result).toBeDefined()
  expect(result?.activeTabId).toBe(2)
  expect(result?.tabs).toHaveLength(3)
})
