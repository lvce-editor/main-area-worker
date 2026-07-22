import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getActiveFileUri } from '../src/parts/GetActiveFileUri/GetActiveFileUri.ts'

const createState = (tabs: readonly Tab[], activeTabId: number | undefined = tabs[0]?.id): MainAreaState => ({
  ...createDefaultState(),
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId,
        focused: true,
        id: 1,
        isEmpty: tabs.length === 0,
        size: 100,
        tabs,
      },
    ],
  },
})

const createTab = (overrides: Partial<Tab> = {}): Tab => ({
  editorType: 'text',
  editorUid: 1,
  icon: '',
  id: 1,
  isDirty: false,
  isPreview: false,
  title: 'file.txt',
  uri: 'file:///file.txt',
  ...overrides,
})

test('returns the active tab uri', () => {
  const tab = createTab()
  expect(getActiveFileUri(createState([tab]))).toBe('file:///file.txt')
})

test('returns the active editor input uri', () => {
  const tab = createTab({ editorInput: { type: 'editor', uri: 'file:///input.txt' }, uri: undefined })
  expect(getActiveFileUri(createState([tab]))).toBe('file:///input.txt')
})

test('returns empty string for an active non-file editor', () => {
  const tab = createTab({ editorInput: { extensionId: 'test.extension', type: 'extension-detail-view' }, uri: undefined })
  expect(getActiveFileUri(createState([tab]))).toBe('')
})

test('returns empty string when no tab is active', () => {
  const state = createState([createTab()])
  const groups = [{ ...state.layout.groups[0], activeTabId: undefined }]
  expect(getActiveFileUri({ ...state, layout: { ...state.layout, groups } })).toBe('')
})

test('returns empty string when the active group does not exist', () => {
  const state = createState([createTab()])
  expect(getActiveFileUri({ ...state, layout: { ...state.layout, activeGroupId: 99 } })).toBe('')
})

test('uses the active group rather than a stale focused group', () => {
  const state = createState([createTab()])
  const otherTab = createTab({ id: 2, uri: 'file:///other.txt' })
  const groups = [
    { ...state.layout.groups[0], focused: true },
    { ...state.layout.groups[0], activeTabId: 2, focused: false, id: 2, tabs: [otherTab] },
  ]
  const activeUri = getActiveFileUri({ ...state, layout: { ...state.layout, activeGroupId: 2, groups } })
  expect(activeUri).toBe('file:///other.txt')
})
