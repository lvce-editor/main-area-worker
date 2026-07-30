import type { DragOverlay, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getOverlay } from '../GetOverlay/GetOverlay.ts'
import { getSplitDirection } from '../GetSplitDirection/GetSplitDirection.ts'

export const getDragOverlay = (state: MainAreaState, eventX: number, eventY: number): DragOverlay => {
  const { height, layout, tabHeight, width, x, y } = state
  const hasOpenEditor = layout.groups.some((group) => !group.isEmpty)
  const contentY = hasOpenEditor ? tabHeight : 0
  const contentHeight = Math.max(0, height - contentY)
  const relativeX = eventX - x
  const relativeY = eventY - y - contentY
  const splitDirection = getSplitDirection(relativeX, relativeY, width, contentHeight)
  return getOverlay(0, contentY, width, contentHeight, splitDirection)
}
