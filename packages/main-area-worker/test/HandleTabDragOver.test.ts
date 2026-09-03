import { expect, test } from '@jest/globals'
import type { EditorGroup, MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleTabDragOver, handleTabsDragOver } from '../src/parts/HandleTabDragOver/HandleTabDragOver.ts'

const createTab = (id: number): Tab => ({
  editorType: 'text',
  editorUid: id,
  icon: '',
  id,
  isDirty: false,
  isPreview: false,
  title: `file-${id}.txt`,
  uri: `file:///file-${id}.txt`,
})

const createGroup = (id: number, size: number, tabs: readonly Tab[]): EditorGroup => ({
  activeTabId: tabs[0]?.id ?? -1,
  direction: 1,
  focused: id === 1,
  id,
  isEmpty: tabs.length === 0,
  size,
  tabs,
})

const createState = (): MainAreaState => ({
  ...createDefaultState(),
  height: 600,
  layout: {
    activeGroupId: 1,
    direction: 1,
    groups: [createGroup(1, 100, [createTab(1), createTab(2), createTab(3)])],
  },
  pointerDownGroupIndex: 0,
  pointerDownTabIndex: 1,
  width: 800,
  x: 100,
})

test('handleTabDragOver shows an insertion indicator before the hovered tab', () => {
  const state = createState()

  const result = handleTabDragOver(state, '0', '0', 20, 100, 0, 160, 10)

  expect(result.tabDropIndicator).toEqual({ groupId: 1, index: 0 })
  expect(result.dragOverlay).toBeUndefined()
})

test('handleTabDragOver shows an insertion indicator after the hovered tab', () => {
  const state = createState()

  const result = handleTabDragOver(state, '0', '1', 120, 100, 0, 280, 10)

  expect(result.tabDropIndicator).toEqual({ groupId: 1, index: 2 })
})

test('handleTabDragOver accounts for horizontal tab strip scrolling', () => {
  const state = createState()

  const result = handleTabDragOver(state, '0', '2', 300, 100, 200, 249, 10)

  expect(result.tabDropIndicator).toEqual({ groupId: 1, index: 2 })
})

test('handleTabDragOver accounts for the target editor group offset', () => {
  const state: MainAreaState = {
    ...createState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [createGroup(1, 50, [createTab(1)]), createGroup(2, 50, [createTab(2), createTab(3)])],
    },
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 0,
  }

  const result = handleTabDragOver(state, '1', '0', 20, 100, 0, 519, 10)

  expect(result.tabDropIndicator).toEqual({ groupId: 2, index: 0 })
})

test('handleTabsDragOver shows an insertion indicator after the final tab', () => {
  const state = createState()

  const result = handleTabsDragOver(state, '0', 700, 10)

  expect(result.tabDropIndicator).toEqual({ groupId: 1, index: 3 })
})

test('tab drag over replaces the editor-area overlay', () => {
  const state: MainAreaState = {
    ...createState(),
    dragOverlay: { height: 100, width: 100, x: 0, y: 35 },
  }

  const result = handleTabDragOver(state, '0', '0', 20, 100, 0, 160, 10)

  expect(result.dragOverlay).toBeUndefined()
  expect(result.tabDropIndicator).toEqual({ groupId: 1, index: 0 })
})

test('external drag over a tab keeps the existing editor-area drop behavior', () => {
  const state: MainAreaState = {
    ...createState(),
    pointerDownGroupIndex: -1,
    pointerDownTabIndex: -1,
  }

  const result = handleTabDragOver(state, '0', '0', 20, 100, 0, 400, 300)

  expect(result.tabDropIndicator).toBeUndefined()
  expect(result.dragOverlay).toBeDefined()
})

test('external drag over tab strip whitespace keeps the existing editor-area drop behavior', () => {
  const state: MainAreaState = {
    ...createState(),
    pointerDownGroupIndex: -1,
    pointerDownTabIndex: -1,
  }

  const result = handleTabsDragOver(state, '0', 400, 300)

  expect(result.tabDropIndicator).toBeUndefined()
  expect(result.dragOverlay).toBeDefined()
})

test('handleTabDragOver ignores an invalid target group', () => {
  const state = createState()

  expect(handleTabDragOver(state, '99', '0', 20, 100, 0, 160, 10)).toBe(state)
})

test('handleTabDragOver returns the same state for an unchanged insertion point', () => {
  const state: MainAreaState = {
    ...createState(),
    tabDropIndicator: { groupId: 1, index: 0 },
  }

  expect(handleTabDragOver(state, '0', '0', 20, 100, 0, 160, 10)).toBe(state)
})

test('handleTabDragOver ignores an invalid target tab', () => {
  const state = createState()

  expect(handleTabDragOver(state, '0', '99', 20, 100, 0, 160, 10)).toBe(state)
})

test('handleTabsDragOver ignores an invalid target group', () => {
  const state = createState()

  expect(handleTabsDragOver(state, '99', 700, 10)).toBe(state)
})
