import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import { getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

export interface SashCorner {
  readonly leftOffset: number
  readonly topOffset: number
  readonly xAfterGroupIds: readonly number[]
  readonly xBeforeGroupIds: readonly number[]
  readonly yAfterGroupIds: readonly number[]
  readonly yBeforeGroupIds: readonly number[]
}

const offsetsMatch = (first: number, second: number): boolean => {
  return Math.abs(first - second) < 1e-6
}

export const getSashCorner = (layout: MainAreaLayout): SashCorner | undefined => {
  const segments = getGroupSegments(layout.groups, layout.direction)
  if (segments.length !== 2) {
    return undefined
  }
  const [firstSegment, secondSegment] = segments
  if (
    firstSegment.direction === undefined ||
    secondSegment.direction !== firstSegment.direction ||
    firstSegment.groups.length !== 2 ||
    secondSegment.groups.length !== 2
  ) {
    return undefined
  }

  const firstSegmentSize = getSegmentSize(firstSegment)
  const secondSegmentSize = getSegmentSize(secondSegment)
  const totalSize = firstSegmentSize + secondSegmentSize
  if (!firstSegmentSize || !secondSegmentSize || !totalSize) {
    return undefined
  }

  const firstNestedOffset = (firstSegment.groups[0].size / firstSegmentSize) * 100
  const secondNestedOffset = (secondSegment.groups[0].size / secondSegmentSize) * 100
  if (!offsetsMatch(firstNestedOffset, secondNestedOffset)) {
    return undefined
  }

  const rootOffset = (firstSegmentSize / totalSize) * 100
  if (layout.direction === LayoutDirection.Horizontal) {
    return {
      leftOffset: rootOffset,
      topOffset: firstNestedOffset,
      xAfterGroupIds: secondSegment.groups.map((group) => group.id),
      xBeforeGroupIds: firstSegment.groups.map((group) => group.id),
      yAfterGroupIds: [firstSegment.groups[1].id, secondSegment.groups[1].id],
      yBeforeGroupIds: [firstSegment.groups[0].id, secondSegment.groups[0].id],
    }
  }
  return {
    leftOffset: firstNestedOffset,
    topOffset: rootOffset,
    xAfterGroupIds: [firstSegment.groups[1].id, secondSegment.groups[1].id],
    xBeforeGroupIds: [firstSegment.groups[0].id, secondSegment.groups[0].id],
    yAfterGroupIds: secondSegment.groups.map((group) => group.id),
    yBeforeGroupIds: firstSegment.groups.map((group) => group.id),
  }
}
