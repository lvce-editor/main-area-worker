import { expect, test } from '@jest/globals'
import type { Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { isValidTab } from '../src/parts/IsValidTab/IsValidTab.ts'

test('isValidTab should return true for valid text tab', () => {
  const tab: Tab = {
    content: 'content',
    editorType: 'text',
          editorUid: -1,
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(true)
})

test('isValidTab should return true for valid custom tab', () => {
  const tab: Tab = {
    content: 'content',
    customEditorId: 'custom-editor-1',
    editorType: 'custom',
          editorUid: -1,
    id: 1,
    isDirty: false,
    title: 'Custom File',
  }
  expect(isValidTab(tab)).toBe(true)
})

test('isValidTab should return false for null', () => {
  expect(isValidTab(null)).toBeFalsy()
})

test('isValidTab should return false for undefined', () => {
  expect(isValidTab(undefined)).toBeFalsy()
})

test('isValidTab should return false for missing id', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
          editorUid: -1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid id type', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
          editorUid: -1,
    id: '1',
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing title', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
          editorUid: -1,
    id: 1,
    isDirty: false,
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid title type', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
          editorUid: -1,
    id: 1,
    isDirty: false,
    title: 123,
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing content', () => {
  const tab = {
    editorType: 'text',
          editorUid: -1,
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid content type', () => {
  const tab = {
    content: 123,
    editorType: 'text',
          editorUid: -1,
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing isDirty', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
          editorUid: -1,
    id: 1,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid isDirty type', () => {
  const tab = {
    content: 'content',
    editorType: 'text',
          editorUid: -1,
    id: 1,
    isDirty: 'true',
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid editorType', () => {
  const tab = {
    content: 'content',
    editorType: 'invalid',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for custom tab without customEditorId', () => {
  const tab = {
    content: 'content',
    editorType: 'custom',
          editorUid: -1,
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for custom tab with invalid customEditorId type', () => {
  const tab = {
    content: 'content',
    customEditorId: 123,
    editorType: 'custom',
          editorUid: -1,
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})
