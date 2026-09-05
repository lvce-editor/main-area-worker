import { expect, test } from '@jest/globals'
import type { ClosedTabEntry, EditorGroup, MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { restoreClosedTabState } from '../src/parts/RestoreClosedTabState/RestoreClosedTabState.ts'

const createTab = (id: number, title: string, uri: string): Tab => ({
  editorUid: -1,
  icon: '',
  id,
  isDirty: false,
  isPreview: false,
  title,
  uri,
})

const createGroup = (id: number, tabs: readonly Tab[], activeTabId = tabs[0]?.id ?? -1, focused = true, size = 100): EditorGroup => ({
  activeTabId,
  direction: 1,
  focused,
  id,
  isEmpty: tabs.length === 0,
  size,
  tabs,
})

const createEntry = (group: EditorGroup, tab: Tab, groupIndex = 0, tabIndex = 0): ClosedTabEntry => ({
  group,
  groupIndex,
  tab,
  tabIndex,
})

test('restoreClosedTabState should restore a cached tab at its original index', () => {
  const tab1 = createTab(1, 'file-1.ts', '/tmp/file-1.ts')
  const tab2 = createTab(2, 'file-2.ts', '/tmp/file-2.ts')
  const tab3 = createTab(3, 'file-3.ts', '/tmp/file-3.ts')
  const originalGroup = createGroup(1, [tab1, tab2, tab3], 2)
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [createGroup(1, [tab1, tab3], 3)],
    },
  }

  const result = restoreClosedTabState(state, createEntry(originalGroup, tab2, 0, 1))

  expect(result).toBeDefined()
  expect(result?.groupIndex).toBe(0)
  expect(result?.tabIndex).toBe(1)
  expect(result?.newState.layout.activeGroupId).toBe(1)
  expect(result?.newState.layout.groups[0].activeTabId).toBe(2)
  expect(result?.newState.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([1, 2, 3])
  expect(result?.newState.layout.groups[0].tabs[1].editorUid).toBe(-1)
})

test('restoreClosedTabState should restore a binary tab as a binary placeholder', () => {
  const binaryTab: Tab = {
    ...createTab(1, 'hello.beam', '/tmp/hello.beam'),
    editorInput: {
      type: 'binary',
      uri: '/tmp/hello.beam',
    },
    loadingState: 'binary',
  }
  const originalGroup = createGroup(1, [binaryTab])

  const result = restoreClosedTabState(createDefaultState(), createEntry(originalGroup, binaryTab))

  expect(result?.newState.layout.groups[0].tabs[0]).toMatchObject({
    editorInput: {
      type: 'binary',
      uri: '/tmp/hello.beam',
    },
    editorUid: -1,
    loadingState: 'binary',
  })
})

test('restoreClosedTabState should recreate a removed group at its original position', () => {
  const left = createGroup(1, [createTab(1, 'left.ts', '/tmp/left.ts')], 1, false, 50)
  const middleTab = createTab(2, 'middle.ts', '/tmp/middle.ts')
  const middle = createGroup(2, [middleTab], 2, true, 50)
  const right = createGroup(3, [createTab(3, 'right.ts', '/tmp/right.ts')], 3, false, 50)
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 3,
      direction: 1,
      groups: [left, right],
    },
  }

  const result = restoreClosedTabState(state, createEntry(middle, middleTab, 1))

  expect(result?.newState.layout.groups.map((group) => group.id)).toEqual([1, 2, 3])
  expect(result?.newState.layout.groups[1].tabs.map((tab) => tab.id)).toEqual([2])
  expect(result?.newState.layout.activeGroupId).toBe(2)
  expect(result?.groupIndex).toBe(1)
  expect(result?.tabIndex).toBe(0)
})

test('restoreClosedTabState should focus an existing tab instead of restoring a duplicate uri', () => {
  const cachedTab = createTab(1, 'shared.ts', '/tmp/shared.ts')
  const existingTab = createTab(2, 'shared.ts', '/tmp/shared.ts')
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [createGroup(2, [existingTab], 2)],
    },
  }

  const result = restoreClosedTabState(state, createEntry(createGroup(1, [cachedTab]), cachedTab))

  expect(result?.newState.layout.groups).toHaveLength(1)
  expect(result?.newState.layout.groups[0].tabs).toHaveLength(1)
  expect(result?.groupIndex).toBe(0)
  expect(result?.tabIndex).toBe(0)
})

test('restoreClosedTabState should focus a duplicate tab and unfocus other groups', () => {
  const cachedTab = createTab(1, 'shared.ts', '/tmp/shared.ts')
  const duplicateTab = createTab(2, 'shared.ts', '/tmp/shared.ts')
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [createGroup(1, [createTab(3, 'other.ts', '/tmp/other.ts')], 3, true, 50), createGroup(2, [duplicateTab], 2, false, 50)],
    },
  }

  const result = restoreClosedTabState(state, createEntry(createGroup(1, [cachedTab]), cachedTab))

  expect(result?.newState.layout.activeGroupId).toBe(2)
  expect(result?.newState.layout.groups.map((group) => group.focused)).toEqual([false, true])
})

test('restoreClosedTabState should restore a tab without a uri into its existing group', () => {
  const tab = createTab(2, 'Untitled', '')
  const originalGroup = createGroup(2, [tab], 2, true, 50)
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [createGroup(1, [createTab(1, 'file.ts', '/tmp/file.ts')], 1, true, 50), createGroup(2, [], -1, false, 50)],
    },
  }

  const result = restoreClosedTabState(state, createEntry(originalGroup, tab, 1))

  expect(result?.newState.layout.groups[0].focused).toBe(false)
  expect(result?.newState.layout.groups[1].tabs).toHaveLength(1)
  expect(result?.newState.layout.groups[1].focused).toBe(true)
})

test('restoreClosedTabState should recreate the only group', () => {
  const tab = createTab(1, 'file.ts', '/tmp/file.ts')
  const group = createGroup(1, [tab])

  const result = restoreClosedTabState(createDefaultState(), createEntry(group, tab))

  expect(result?.newState.layout.groups).toHaveLength(1)
  expect(result?.newState.layout.activeGroupId).toBe(1)
  expect(result?.newState.layout.groups[0].tabs[0].editorUid).toBe(-1)
})
