import type { DragOverlay, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../EditorSplitDirection/EditorSplitDirection.ts'

const getSplitDirection = (x: number, y: number, width: number, height: number): number => {
  const percentX = x / width
  if (percentX < 0.25) {
    return EditorSplitDirection.Left
  }
  if (percentX > 0.75) {
    return EditorSplitDirection.Right
  }
  const percentY = y / height
  if (percentY < 0.25) {
    return EditorSplitDirection.Up
  }
  if (percentY > 0.75) {
    return EditorSplitDirection.Down
  }
  return EditorSplitDirection.None
}

const getOverlay = (x: number, y: number, width: number, height: number, splitDirection: number): DragOverlay => {
  const halfHeight = height / 2
  const halfWidth = width / 2
  switch (splitDirection) {
    case EditorSplitDirection.Down:
      return { height: halfHeight, width, x, y: y + halfHeight }
    case EditorSplitDirection.Left:
      return { height, width: halfWidth, x, y }
    case EditorSplitDirection.Right:
      return { height, width: halfWidth, x: x + halfWidth, y }
    case EditorSplitDirection.Up:
      return { height: halfHeight, width, x, y }
    default:
      return { height, width, x, y }
  }
}

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
