import { expect, test } from '@jest/globals'
import type { Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { isValidTab } from '../src/parts/IsValidTab/IsValidTab.ts'

test('isValidTab should return true for valid text tab', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(true)
})

test('isValidTab should return true for valid custom tab', () => {
  const tab: Tab = {
    editorType: 'custom',
    editorUid: -1,
    icon: '',
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
    editorType: 'text',
    editorUid: -1,
    icon: '',
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid id type', () => {
  const tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: '1',
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing title', () => {
  const tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid title type', () => {
  const tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 123,
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing editorUid', () => {
  const tab = {
    editorType: 'text',
    icon: '',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid editorUid type', () => {
  const tab = {
    editorType: 'text',
    editorUid: 'invalid',
    icon: '',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing isDirty', () => {
  const tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid isDirty type', () => {
  const tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: 'true',
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid editorType', () => {
  const tab = {
    editorType: 'invalid',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for missing icon', () => {
  const tab = {
    editorType: 'text',
    editorUid: -1,
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})

test('isValidTab should return false for invalid icon type', () => {
  const tab = {
    editorType: 'text',
    editorUid: -1,
    icon: 123,
    id: 1,
    isDirty: false,
    title: 'File',
  }
  expect(isValidTab(tab)).toBe(false)
})
