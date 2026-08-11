import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import { collapseSingleGroupSegments } from '../src/parts/CollapseSingleGroupSegments/CollapseSingleGroupSegments.ts'
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

test('returns the same groups when there are no single-group nested segments', () => {
  const groups = [
    createGroup(1, LayoutDirection.Horizontal),
    createGroup(2, LayoutDirection.Vertical, 2),
    createGroup(3, LayoutDirection.Vertical, 2),
  ]

  expect(collapseSingleGroupSegments(groups, LayoutDirection.Horizontal)).toBe(groups)
})

test('collapses a single-group nested segment into the root layout', () => {
  const groups = [createGroup(1, LayoutDirection.Horizontal), createGroup(2, LayoutDirection.Vertical, 2)]

  const result = collapseSingleGroupSegments(groups, LayoutDirection.Horizontal)

  expect(result[0]).toBe(groups[0])
  expect(result[1]).toMatchObject({
    direction: LayoutDirection.Horizontal,
    id: 2,
    size: 50,
  })
  expect(Object.hasOwn(result[1], 'segmentId')).toBe(false)
})

test('collapses each single-group nested segment independently', () => {
  const groups = [createGroup(1, LayoutDirection.Vertical, 1), createGroup(2, LayoutDirection.Vertical, 2)]

  const result = collapseSingleGroupSegments(groups, LayoutDirection.Horizontal)

  expect(result.map((group) => group.direction)).toEqual([LayoutDirection.Horizontal, LayoutDirection.Horizontal])
})
