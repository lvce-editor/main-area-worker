import { expect, test } from '@jest/globals'
import type { EditorGroup, MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'
import { flipLayout, setEditorLayout } from '../src/parts/SetEditorLayout/SetEditorLayout.ts'
import {
  setEditorLayoutGrid,
  setEditorLayoutSingle,
  setEditorLayoutThreeColumns,
  setEditorLayoutThreeRows,
  setEditorLayoutTwoColumns,
  setEditorLayoutTwoColumnsBottom,
  setEditorLayoutTwoRows,
  setEditorLayoutTwoRowsRight,
} from '../src/parts/SetEditorLayout/SetEditorLayout.ts'

const createGroup = (
  id: number,
  size: number,
  focused = false,
  direction: LayoutDirection.LayoutDirection = LayoutDirection.Horizontal,
): EditorGroup => {
  return {
    activeTabId: id,
    direction,
    focused,
    id,
    isEmpty: false,
    size,
    tabs: [
      {
        editorType: 'text',
        editorUid: id,
        icon: '',
        id,
        isDirty: false,
        isPreview: false,
        title: `file-${id}.txt`,
        uri: `/workspace/file-${id}.txt`,
      },
    ],
  }
}

const createState = (groups: readonly EditorGroup[], activeGroupId = groups[0]?.id): MainAreaState => {
  return {
    ...createDefaultState(),
    layout: {
      activeGroupId,
      direction: LayoutDirection.Horizontal,
      groups,
    },
  }
}

test('setEditorLayoutSingle merges all tabs into one group', () => {
  const state = createState([createGroup(1, 33), createGroup(2, 33), createGroup(3, 34)], 2)

  const result = setEditorLayoutSingle(state)

  expect(result.layout.direction).toBe(LayoutDirection.Horizontal)
  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([1, 2, 3])
  expect(result.layout.groups[0].activeTabId).toBe(2)
  expect(result.layout.groups[0].size).toBe(100)
})

test('setEditorLayout expands missing groups with empty groups', () => {
  const state = createState([createGroup(1, 100)])

  const result = setEditorLayout(state, LayoutDirection.Horizontal, [
    { direction: LayoutDirection.Horizontal, size: 33.333333 },
    { direction: LayoutDirection.Horizontal, size: 33.333333 },
    { direction: LayoutDirection.Horizontal, size: 33.333334 },
  ])

  expect(result.layout.groups).toHaveLength(3)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[1].isEmpty).toBe(true)
  expect(result.layout.groups[2].isEmpty).toBe(true)
})

test('setEditorLayout merges extra groups into the final slot', () => {
  const state = createState([createGroup(1, 25), createGroup(2, 25), createGroup(3, 25), createGroup(4, 25)], 4)

  const result = setEditorLayout(state, LayoutDirection.Vertical, [
    { direction: LayoutDirection.Vertical, size: 50 },
    { direction: LayoutDirection.Vertical, size: 50 },
  ])

  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].tabs.map((tab) => tab.id)).toEqual([1])
  expect(result.layout.groups[1].tabs.map((tab) => tab.id)).toEqual([2, 3, 4])
  expect(result.layout.groups[1].activeTabId).toBe(4)
})

test('setEditorLayoutGrid creates two columns with two rows each', () => {
  const state = createState([])

  const result = setEditorLayoutGrid(state)

  expect(result.layout.direction).toBe(LayoutDirection.Horizontal)
  expect(result.layout.groups).toHaveLength(4)
  expect(result.layout.groups.map((group) => group.direction)).toEqual([
    LayoutDirection.Vertical,
    LayoutDirection.Vertical,
    LayoutDirection.Vertical,
    LayoutDirection.Vertical,
  ])
  expect(result.layout.groups[0].segmentId).toBe(result.layout.groups[1].segmentId)
  expect(result.layout.groups[2].segmentId).toBe(result.layout.groups[3].segmentId)
  expect(result.layout.groups[0].segmentId).not.toBe(result.layout.groups[2].segmentId)
  expect(result.layout.groups.map((group) => group.size)).toEqual([25, 25, 25, 25])
})

test('setEditorLayoutTwoRowsRight creates one left column and two rows on the right', () => {
  const state = createState([createGroup(1, 100)])

  const result = setEditorLayoutTwoRowsRight(state)

  expect(result.layout.direction).toBe(LayoutDirection.Horizontal)
  expect(result.layout.groups.map((group) => group.direction)).toEqual([
    LayoutDirection.Horizontal,
    LayoutDirection.Vertical,
    LayoutDirection.Vertical,
  ])
  expect(result.layout.groups.map((group) => group.size)).toEqual([50, 25, 25])
})

test('setEditorLayoutTwoColumnsBottom creates one top row and two columns on the bottom', () => {
  const state = createState([createGroup(1, 100)])

  const result = setEditorLayoutTwoColumnsBottom(state)

  expect(result.layout.direction).toBe(LayoutDirection.Vertical)
  expect(result.layout.groups.map((group) => group.direction)).toEqual([
    LayoutDirection.Vertical,
    LayoutDirection.Horizontal,
    LayoutDirection.Horizontal,
  ])
  expect(result.layout.groups.map((group) => group.size)).toEqual([50, 25, 25])
})

test('flipLayout flips root and nested directions', () => {
  const state = createState([createGroup(1, 25, false, LayoutDirection.Vertical), createGroup(2, 25, false, LayoutDirection.Vertical)])

  const result = flipLayout(state)

  expect(result.layout.direction).toBe(LayoutDirection.Vertical)
  expect(result.layout.groups.map((group) => group.direction)).toEqual([LayoutDirection.Horizontal, LayoutDirection.Horizontal])
})

test('setEditorLayout uses the focused group when the active group id is stale', () => {
  const state = createState([createGroup(1, 50), createGroup(2, 50, true)], 999)

  const result = setEditorLayoutTwoColumns(state)

  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.groups.map((group) => group.focused)).toEqual([false, true])
})

test('setEditorLayout preserves groups when the slot count already matches', () => {
  const firstGroup = createGroup(1, 50, true)
  const secondGroup = createGroup(2, 50)
  const state = createState([firstGroup, secondGroup], 1)

  const result = setEditorLayoutTwoRows(state)

  expect(result.layout.groups[0]).toMatchObject({ id: 1, size: 50 })
  expect(result.layout.groups[1]).toMatchObject({ id: 2, size: 50 })
  expect(result.layout.direction).toBe(LayoutDirection.Vertical)
})

test('setEditorLayoutSingle creates an empty group when the layout has no groups', () => {
  const state = createState([])

  const result = setEditorLayoutSingle(state)

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0]).toMatchObject({
    activeTabId: -1,
    focused: true,
    isEmpty: true,
    size: 100,
    tabs: [],
  })
})

test('setEditorLayoutSingle falls back to the last group with an active tab', () => {
  const firstGroup = { ...createGroup(1, 50), activeTabId: -1 }
  const secondGroup = createGroup(2, 50)
  const state = createState([firstGroup, secondGroup], 999)

  const result = setEditorLayoutSingle(state)

  expect(result.layout.groups[0].activeTabId).toBe(2)
})

test('setEditorLayoutSingle falls back to the first merged tab', () => {
  const firstGroup = { ...createGroup(1, 50), activeTabId: -1 }
  const secondGroup = { ...createGroup(2, 50), activeTabId: -1 }
  const state = createState([firstGroup, secondGroup], 999)

  const result = setEditorLayoutSingle(state)

  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('setEditorLayout supports an empty slot list', () => {
  const state = createState([createGroup(1, 100)])

  const result = setEditorLayout(state, LayoutDirection.Horizontal, [])

  expect(result.layout.groups).toEqual([])
  expect(result.layout.activeGroupId).toBe(-1)
})

test('flipLayout flips root group directions', () => {
  const state = createState([createGroup(1, 100)])

  const result = flipLayout(state)

  expect(result.layout.groups[0].direction).toBe(LayoutDirection.Vertical)
})

test('layout presets create the requested row and column counts', () => {
  const state = createState([createGroup(1, 100)])

  expect(setEditorLayoutThreeColumns(state).layout.groups).toHaveLength(3)
  expect(setEditorLayoutThreeRows(state).layout.groups).toHaveLength(3)
  expect(setEditorLayoutTwoColumns(state).layout.groups).toHaveLength(2)
  expect(setEditorLayoutTwoRows(state).layout.groups).toHaveLength(2)
})
