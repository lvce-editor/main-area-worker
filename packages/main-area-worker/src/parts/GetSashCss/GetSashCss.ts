import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import { getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import { getSashOffset } from '../GetSashOffset/GetSashOffset.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import * as SashId from '../SashId/SashId.ts'

const escapeCssAttributeValue = (value: string): string => {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
}

export const getSashCss = (layout: MainAreaLayout, width: number = 0): readonly string[] => {
  if (layout.groups.length <= 1) {
    return []
  }
  const rules: string[] = []
  const segments = getGroupSegments(layout.groups, layout.direction)
  const sashPositionProperty = layout.direction === LayoutDirection.Horizontal ? 'left' : 'top'
  let segmentOffset = 0
  for (let i = 1; i < segments.length; i++) {
    segmentOffset += getSegmentSize(segments[i - 1])
    const beforeGroupId = segments[i - 1].groups.at(-1)?.id || 0
    const afterGroupId = segments[i].groups[0].id
    const sashId = SashId.create(beforeGroupId, afterGroupId)
    const escapedSashId = escapeCssAttributeValue(sashId)
    const sashOffset =
      segments.some((segment) => segment.direction !== undefined) || layout.direction !== LayoutDirection.Horizontal || !width
        ? `${segmentOffset}%`
        : getSashOffset(layout, i, width)
    rules.push(`[data-sash-id="${escapedSashId}"] {
  ${sashPositionProperty}: ${sashOffset};
}`)
  }
  for (const segment of segments) {
    if (segment.direction === undefined || segment.groups.length <= 1) {
      continue
    }
    const nestedProperty = segment.direction === LayoutDirection.Horizontal ? 'left' : 'top'
    const segmentSize = getSegmentSize(segment)
    let nestedOffset = 0
    for (let i = 1; i < segment.groups.length; i++) {
      nestedOffset += segment.groups[i - 1].size
      const beforeGroupId = segment.groups[i - 1].id
      const afterGroupId = segment.groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
      const escapedSashId = escapeCssAttributeValue(sashId)
      const relativeOffset = Number(((nestedOffset / segmentSize) * 100).toFixed(6))
      rules.push(`[data-sashId="${escapedSashId}"] {
  ${nestedProperty}: ${relativeOffset}%;
}`)
    }
  }
  return rules
}
