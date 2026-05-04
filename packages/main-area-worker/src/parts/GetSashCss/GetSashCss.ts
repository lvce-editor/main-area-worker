import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import { getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import { getSashOffset } from '../GetSashOffset/GetSashOffset.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import * as SashId from '../SashId/SashId.ts'

interface ProtoSashCss {
  readonly property: 'left' | 'top'
  readonly sashId: string
  readonly value: string
}

const escapeCssAttributeValue = (value: string): string => {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
}

const toSashProperty = (direction: LayoutDirection.LayoutDirection): 'left' | 'top' => {
  return direction === LayoutDirection.Horizontal ? 'left' : 'top'
}

const renderSashCss = ({ property, sashId, value }: ProtoSashCss): string => {
  const escapedSashId = escapeCssAttributeValue(sashId)
  return `[data-sash-id="${escapedSashId}"] {
  ${property}: ${value};
}`
}

const getProtoSashCss = (layout: MainAreaLayout, width: number): readonly ProtoSashCss[] => {
  const segments = getGroupSegments(layout.groups, layout.direction)
  const hasNestedSegments = segments.some((segment) => segment.direction !== undefined)
  const rules: ProtoSashCss[] = []
  let segmentOffset = 0
  for (let i = 1; i < segments.length; i++) {
    segmentOffset += getSegmentSize(segments[i - 1])
    const beforeGroupId = segments[i - 1].groups.at(-1)?.id || 0
    const afterGroupId = segments[i].groups[0].id
    const sashId = SashId.create(beforeGroupId, afterGroupId)
    const value =
      hasNestedSegments || layout.direction !== LayoutDirection.Horizontal || !width ? `${segmentOffset}%` : getSashOffset(layout, i, width)
    rules.push({
      property: toSashProperty(layout.direction),
      sashId,
      value,
    })
  }
  for (const segment of segments) {
    if (segment.direction === undefined || segment.groups.length <= 1) {
      continue
    }
    const segmentSize = getSegmentSize(segment)
    let nestedOffset = 0
    for (let i = 1; i < segment.groups.length; i++) {
      nestedOffset += segment.groups[i - 1].size
      const beforeGroupId = segment.groups[i - 1].id
      const afterGroupId = segment.groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
      const value = `${Number(((nestedOffset / segmentSize) * 100).toFixed(6))}%`
      rules.push({
        property: toSashProperty(segment.direction),
        sashId,
        value,
      })
    }
  }
  return rules
}

export const getSashCss = (layout: MainAreaLayout, width: number = 0): readonly string[] => {
  if (layout.groups.length <= 1) {
    return []
  }
  return getProtoSashCss(layout, width).map(renderSashCss)
}
