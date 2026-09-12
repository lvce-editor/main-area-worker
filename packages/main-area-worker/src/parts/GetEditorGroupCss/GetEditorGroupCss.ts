import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import { getEditorGroupClassName } from '../GetEditorGroupClassName/GetEditorGroupClassName.ts'
import { getEditorGroupSegmentClassName } from '../GetEditorGroupSegmentClassName/GetEditorGroupSegmentClassName.ts'
import { getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'

const getSizeCss = (className: string, direction: number, size: number): string => {
  const width = direction === LayoutDirection.Vertical ? 100 : size
  const height = direction === LayoutDirection.Vertical ? size : 100
  return `.${className} {
  --EditorGroupWidth: ${width}%;
  --EditorGroupHeight: ${height}%;
  width: var(--EditorGroupWidth);
  height: var(--EditorGroupHeight);
}`
}

export const getEditorGroupCss = (layout: MainAreaLayout): readonly string[] => {
  const { direction, groups } = layout
  const rules: string[] = []
  for (const segment of getGroupSegments(groups, direction)) {
    if (segment.direction === undefined) {
      const group = segment.groups[0]
      rules.push(getSizeCss(getEditorGroupClassName(group.id), direction, group.size))
      continue
    }
    const segmentSize = getSegmentSize(segment)
    rules.push(getSizeCss(getEditorGroupSegmentClassName(segment.groups[0].id), direction, segmentSize))
    for (const group of segment.groups) {
      const normalizedSize = Number(((group.size / segmentSize) * 100).toFixed(6))
      rules.push(getSizeCss(getEditorGroupClassName(group.id), segment.direction, normalizedSize))
    }
  }
  return rules
}
