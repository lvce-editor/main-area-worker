import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { clamp } from '../Clamp/Clamp.ts'
import type { GroupSegment } from '../GetGroupSegments/GetGroupSegments.ts'
import { getGroupSegment, getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import { getMinGroupSizePercent } from '../GetMinGroupSizePercent/GetMinGroupSizePercent.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
import { round } from '../Round/Round.ts'

const resizeGroupInSegment = (segment: GroupSegment, groupId: number, segmentSize: number): number | undefined => {
  const group = segment.groups.find((group) => group.id === groupId)
  if (!group) {
    return undefined
  }
  const previousSegmentSize = getSegmentSize(segment)
  return round((group.size / previousSegmentSize) * segmentSize)
}

export const handleSashPointerMove = async (state: MainAreaState, clientX: number, clientY: number): Promise<MainAreaState> => {
  const { height, layout, minGroupHeightPx, minGroupWidthPx, sashDrag, width } = state
  if (!sashDrag) {
    return state
  }

  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return state
  }
  const { direction, groups } = layout
  const segments = getGroupSegments(groups, direction)
  const beforeSegment = getGroupSegment(segments, sashDrag.beforeGroupId)
  const afterSegment = getGroupSegment(segments, sashDrag.afterGroupId)
  if (!beforeSegment || !afterSegment) {
    return state
  }
  const isNestedSash = beforeSegment === afterSegment

  const axisSize = direction === LayoutDirection.Horizontal ? width : height
  if (!axisSize) {
    return state
  }

  const deltaPx = direction === LayoutDirection.Horizontal ? clientX - sashDrag.startClientX : clientY - sashDrag.startClientY
  const deltaPercent = (deltaPx / axisSize) * 100

  const totalResizableSize = sashDrag.beforeSize + sashDrag.afterSize
  const minGroupSizePx = direction === LayoutDirection.Horizontal ? minGroupWidthPx : minGroupHeightPx
  let minGroupSize = getMinGroupSizePercent(axisSize, minGroupSizePx)

  // If the minimum size makes it impossible to fit two groups, relax the constraint
  if (2 * minGroupSize > totalResizableSize) {
    minGroupSize = totalResizableSize / 2
  }

  const beforeSize = clamp(sashDrag.beforeSize + deltaPercent, minGroupSize, totalResizableSize - minGroupSize)
  const afterSize = totalResizableSize - beforeSize

  const newGroups = groups.map((group) => {
    if (!isNestedSash) {
      const resizedBeforeGroupSize = resizeGroupInSegment(beforeSegment, group.id, beforeSize)
      if (resizedBeforeGroupSize !== undefined) {
        return {
          ...group,
          size: resizedBeforeGroupSize,
        }
      }
      const resizedAfterGroupSize = resizeGroupInSegment(afterSegment, group.id, afterSize)
      if (resizedAfterGroupSize !== undefined) {
        return {
          ...group,
          size: resizedAfterGroupSize,
        }
      }
      return group
    }
    if (group.id === sashDrag.beforeGroupId) {
      return {
        ...group,
        size: round(beforeSize),
      }
    }
    if (group.id === sashDrag.afterGroupId) {
      return {
        ...group,
        size: round(afterSize),
      }
    }
    return group
  })

  return {
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}
