import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getGroupSegment, getGroupSegments, getSegmentSize } from '../GetGroupSegments/GetGroupSegments.ts'
import * as SashId from '../SashId/SashId.ts'

export const handleSashPointerDown = async (state: MainAreaState, sashId: string, clientX: number, clientY: number): Promise<MainAreaState> => {
  const parsed = SashId.parse(sashId)
  if (!parsed) {
    return state
  }
  const { layout } = state
  const { groups } = layout
  const beforeGroup = groups.find((group) => group.id === parsed.beforeGroupId)
  const afterGroup = groups.find((group) => group.id === parsed.afterGroupId)
  if (!beforeGroup || !afterGroup) {
    return state
  }
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) {
    return state
  }
  const segments = getGroupSegments(groups, layout.direction)
  const beforeSegment = getGroupSegment(segments, parsed.beforeGroupId)
  const afterSegment = getGroupSegment(segments, parsed.afterGroupId)
  if (!beforeSegment || !afterSegment) {
    return state
  }
  const isNestedSash = beforeSegment === afterSegment
  return {
    ...state,
    sashDrag: {
      afterGroupId: parsed.afterGroupId,
      afterSize: isNestedSash ? afterGroup.size : getSegmentSize(afterSegment),
      beforeGroupId: parsed.beforeGroupId,
      beforeSize: isNestedSash ? beforeGroup.size : getSegmentSize(beforeSegment),
      sashId,
      startClientX: clientX,
      startClientY: clientY,
    },
  }
}
