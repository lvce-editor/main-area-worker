import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import { getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

const getSizeProperty = (direction: number): 'width' | 'height' => {
  return direction === LayoutDirection.Vertical ? 'height' : 'width'
}

const getGroupRule = (groupId: number, property: 'width' | 'height', size: number): string => {
  return `.EditorGroup[data-groupId="${groupId}"] {
  ${property}: ${size}%;
}`
}

export const getEditorGroupCss = (layout: MainAreaLayout): readonly string[] => {
  const segments = getGroupSegments(layout.groups, layout.direction)
  const rules: string[] = []
  for (const segment of segments) {
    if (segment.direction === undefined) {
      const group = segment.groups[0]
      rules.push(getGroupRule(group.id, getSizeProperty(layout.direction), group.size))
      continue
    }
    const segmentSize = getSegmentSize(segment)
    const sizeProperty = getSizeProperty(segment.direction)
    for (const group of segment.groups) {
      const normalizedSize = Number(((group.size / segmentSize) * 100).toFixed(6))
      rules.push(getGroupRule(group.id, sizeProperty, normalizedSize))
    }
  }
  return rules
}
