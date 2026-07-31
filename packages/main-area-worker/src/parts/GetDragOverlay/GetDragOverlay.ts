import type { DragOverlay, EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getOverlay } from '../GetOverlay/GetOverlay.ts'
import { getSplitDirection } from '../GetSplitDirection/GetSplitDirection.ts'

const isNotEmpty = (group: EditorGroup): boolean => {
  return !group.isEmpty
}

export const getDragOverlay = (state: MainAreaState, eventX: number, eventY: number): DragOverlay => {
  const { height, layout, tabHeight, width, x, y } = state
  const { groups } = layout
  const hasOpenEditor = groups.some(isNotEmpty)
  const contentY = hasOpenEditor ? tabHeight : 0
  const contentHeight = Math.max(0, height - contentY)
  const relativeX = eventX - x
  const relativeY = eventY - y - contentY
  const splitDirection = getSplitDirection(relativeX, relativeY, width, contentHeight)
  return getOverlay(0, contentY, width, contentHeight, splitDirection)
}
