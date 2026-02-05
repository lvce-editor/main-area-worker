import { expect, test } from '@jest/globals'
import type { Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { isHtmlFile } from '../src/parts/IsHtmlFile/IsHtmlFile.ts'

test('isHtmlFile should return true for .html file', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'index.html',
    uri: '/path/to/index.html',
  }
  expect(isHtmlFile(tab)).toBe(true)
})

test('isHtmlFile should return true for .html file with complex path', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 2,
    icon: '',
    id: 2,
    isDirty: false,
    title: 'page.html',
    uri: '/some/nested/path/page.html',
  }
  expect(isHtmlFile(tab)).toBe(true)
})

test('isHtmlFile should return false for .js file', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 3,
    icon: '',
    id: 3,
    isDirty: false,
    title: 'script.js',
    uri: '/path/to/script.js',
  }
  expect(isHtmlFile(tab)).toBe(false)
})

test('isHtmlFile should return false for .ts file', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 4,
    icon: '',
    id: 4,
    isDirty: false,
    title: 'component.ts',
    uri: '/path/to/component.ts',
  }
  expect(isHtmlFile(tab)).toBe(false)
})

test('isHtmlFile should return false for .css file', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 5,
    icon: '',
    id: 5,
    isDirty: false,
    title: 'styles.css',
    uri: '/path/to/styles.css',
  }
  expect(isHtmlFile(tab)).toBe(false)
})

test('isHtmlFile should return false for tab with no uri', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 6,
    icon: '',
    id: 6,
    isDirty: false,
    title: 'Untitled',
  }
  expect(isHtmlFile(tab)).toBe(false)
})

test('isHtmlFile should return false for undefined tab', () => {
  expect(isHtmlFile(undefined)).toBe(false)
})

test('isHtmlFile should return false for tab with empty uri', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 7,
    icon: '',
    id: 7,
    isDirty: false,
    title: 'Empty',
    uri: '',
  }
  expect(isHtmlFile(tab)).toBe(false)
})

test('isHtmlFile should return false for file containing .html but not ending with it', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 8,
    icon: '',
    id: 8,
    isDirty: false,
    title: 'index.html.backup',
    uri: '/path/to/index.html.backup',
  }
  expect(isHtmlFile(tab)).toBe(false)
})

test('isHtmlFile should return true for .HTML file with uppercase extension', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 9,
    icon: '',
    id: 9,
    isDirty: false,
    title: 'index.HTML',
    uri: '/path/to/index.HTML',
  }
  expect(isHtmlFile(tab)).toBe(false)
})
