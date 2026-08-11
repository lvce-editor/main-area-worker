import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import { getGroupSegments } from '../src/parts/GetGroupSegments/GetGroupSegments.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

const createGroup = (id: number, direction: LayoutDirection.LayoutDirection, segmentId?: number): EditorGroup => ({
  activeTabId: -1,
  direction,
  focused: false,
  id,
  isEmpty: true,
  segmentId,
  size: 50,
  tabs: [],
})

test('returns root groups as standalone segments', () => {
  const groups = [createGroup(1, LayoutDirection.Horizontal), createGroup(2, LayoutDirection.Horizontal)]

  const result = getGroupSegments(groups, LayoutDirection.Horizontal)

  expect(result.map((segment) => segment.direction)).toEqual([undefined, undefined])
})

test('returns multiple nested groups as a nested segment', () => {
  const groups = [
    createGroup(1, LayoutDirection.Horizontal),
    createGroup(2, LayoutDirection.Vertical, 2),
    createGroup(3, LayoutDirection.Vertical, 2),
  ]

  const result = getGroupSegments(groups, LayoutDirection.Horizontal)

  expect(result.map((segment) => segment.direction)).toEqual([undefined, LayoutDirection.Vertical])
  expect(result[1].groups).toEqual([groups[1], groups[2]])
})

test('returns a single nested group as a standalone segment', () => {
  const groups = [createGroup(1, LayoutDirection.Horizontal), createGroup(2, LayoutDirection.Vertical, 2)]

  const result = getGroupSegments(groups, LayoutDirection.Horizontal)

  expect(result.map((segment) => segment.direction)).toEqual([undefined, undefined])
})
