import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import { isValidEditorGroup } from '../src/parts/IsValidEditorGroup/IsValidEditorGroup.ts'

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
        editorUid: -1,
        id: 1,
        isDirty: false,
        title: 'File',
      },
    ],
  }
  expect(isValidEditorGroup(group)).toBe(true)
})

test('isValidEditorGroup should return true for group with undefined activeTabId', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(true)
})

test('isValidEditorGroup should return false for null', () => {
  expect(isValidEditorGroup(null)).toBeFalsy()
})

test('isValidEditorGroup should return false for undefined', () => {
  expect(isValidEditorGroup(undefined)).toBeFalsy()
})

test('isValidEditorGroup should return false for missing id', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    size: 50,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid id type', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: '1',
    size: 50,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for missing tabs', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: 50,
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid tabs type', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: 50,
    tabs: 'not an array',
  }
  expect(isValidEditorGroup(group)).toBe(false)
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
        editorUid: -1,
        id: '1',
        isDirty: false,
        title: 'File',
      },
    ],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid activeTabId type', () => {
  const group = {
    activeTabId: '1',
    focused: true,
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for missing focused', () => {
  const group = {
    activeTabId: undefined,
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid focused type', () => {
  const group = {
    activeTabId: undefined,
    focused: 'true',
    id: 1,
    size: 50,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for missing size', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for invalid size type', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: '50',
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for size zero', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: 0,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})

test('isValidEditorGroup should return false for negative size', () => {
  const group = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    size: -10,
    tabs: [],
  }
  expect(isValidEditorGroup(group)).toBe(false)
})
