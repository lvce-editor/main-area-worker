import { expect, test } from '@jest/globals'
import type { Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { shouldCreateViewletForSelectedTab } from '../src/parts/SelectTab/ShouldCreateViewletForSelectedTab/ShouldCreateViewletForSelectedTab.ts'

const createTab = (overrides: Partial<Tab> = {}): Tab => {
  return {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'File 1',
    uri: '/tmp/file.txt',
    ...overrides,
  }
}

test('shouldCreateViewletForSelectedTab should return true for unloaded uri tab', () => {
  expect(shouldCreateViewletForSelectedTab(createTab())).toBe(true)
})

test('shouldCreateViewletForSelectedTab should return true for loading tab with editor uid', () => {
  expect(shouldCreateViewletForSelectedTab(createTab({ editorUid: 5, loadingState: 'loading' }))).toBe(true)
})

test('shouldCreateViewletForSelectedTab should return false without uri', () => {
  expect(shouldCreateViewletForSelectedTab(createTab({ uri: undefined }))).toBe(false)
})

test('shouldCreateViewletForSelectedTab should return false for loaded tab with existing editor', () => {
  expect(shouldCreateViewletForSelectedTab(createTab({ editorUid: 5, loadingState: 'loaded' }))).toBe(false)
})
