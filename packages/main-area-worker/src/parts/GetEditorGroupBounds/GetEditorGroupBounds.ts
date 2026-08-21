import type { EditorGroup, MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

export interface EditorGroupBounds {
  readonly group: EditorGroup
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

interface Bounds {
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

const getChildBounds = (bounds: Bounds, direction: LayoutDirection.LayoutDirection, offset: number, size: number): Bounds => {
  if (direction === LayoutDirection.Horizontal) {
    return {
      height: bounds.height,
      width: bounds.width * size,
      x: bounds.x + bounds.width * offset,
      y: bounds.y,
    }
  }
  return {
    height: bounds.height * size,
    width: bounds.width,
    x: bounds.x,
    y: bounds.y + bounds.height * offset,
  }
}

export const getEditorGroupBounds = (layout: MainAreaLayout, width: number, height: number): readonly EditorGroupBounds[] => {
  const { direction, groups } = layout
  const segments = getGroupSegments(groups, direction)
  const rootBounds: Bounds = { height, width, x: 0, y: 0 }
  const result: EditorGroupBounds[] = []
  let segmentOffset = 0
  for (const segment of segments) {
    const segmentSize = getSegmentSize(segment)
    const segmentBounds = getChildBounds(rootBounds, direction, segmentOffset / 100, segmentSize / 100)
    segmentOffset += segmentSize
    if (segment.direction === undefined) {
      result.push({ ...segmentBounds, group: segment.groups[0] })
      continue
    }
    let groupOffset = 0
    for (const group of segment.groups) {
      const groupBounds = getChildBounds(segmentBounds, segment.direction, groupOffset / segmentSize, group.size / segmentSize)
      groupOffset += group.size
      result.push({ ...groupBounds, group })
    }
  }
  return result
}
