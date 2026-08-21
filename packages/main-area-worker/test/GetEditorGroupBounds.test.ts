import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getEditorGroupContentBounds } from '../src/parts/GetEditorGroupBounds/GetEditorGroupBounds.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

const createGroup = (id: number, size: number, direction: LayoutDirection.LayoutDirection, segmentId?: number): EditorGroup => ({
  activeTabId: -1,
  direction,
  focused: false,
  id,
  isEmpty: true,
  segmentId,
  size,
  tabs: [],
})

test('returns bounds with the horizontal offset for a right editor group', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 2,
    direction: LayoutDirection.Horizontal,
    groups: [createGroup(1, 40, LayoutDirection.Horizontal), createGroup(2, 60, LayoutDirection.Horizontal)],
  }

  expect(getEditorGroupContentBounds(layout, { height: 600, width: 1000, x: 50, y: 20 }, 35)).toEqual([
    { groupId: 1, height: 565, width: 400, x: 50, y: 55 },
    { groupId: 2, height: 565, width: 600, x: 450, y: 55 },
  ])
})

test('returns bounds with the vertical offset for a bottom editor group', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 2,
    direction: LayoutDirection.Vertical,
    groups: [createGroup(1, 25, LayoutDirection.Vertical), createGroup(2, 75, LayoutDirection.Vertical)],
  }

  expect(getEditorGroupContentBounds(layout, { height: 800, width: 1000, x: 50, y: 20 }, 35)).toEqual([
    { groupId: 1, height: 165, width: 1000, x: 50, y: 55 },
    { groupId: 2, height: 565, width: 1000, x: 50, y: 255 },
  ])
})

test('returns bounds for editor groups in a nested segment', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 3,
    direction: LayoutDirection.Horizontal,
    groups: [
      createGroup(1, 50, LayoutDirection.Horizontal),
      createGroup(2, 25, LayoutDirection.Vertical, 2),
      createGroup(3, 25, LayoutDirection.Vertical, 2),
    ],
  }

  expect(getEditorGroupContentBounds(layout, { height: 600, width: 1000, x: 50, y: 20 }, 35)).toEqual([
    { groupId: 1, height: 565, width: 500, x: 50, y: 55 },
    { groupId: 2, height: 265, width: 500, x: 550, y: 55 },
    { groupId: 3, height: 265, width: 500, x: 550, y: 355 },
  ])
})
