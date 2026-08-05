import type { DragOverlay } from '../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../EditorSplitDirection/EditorSplitDirection.ts'

export const getOverlay = (x: number, y: number, width: number, height: number, splitDirection: number): DragOverlay => {
  const halfHeight = height / 2
  const halfWidth = width / 2
  switch (splitDirection) {
    case EditorSplitDirection.Down:
      return { height: halfHeight, splitDirection, width, x, y: y + halfHeight }
    case EditorSplitDirection.Left:
      return { height, splitDirection, width: halfWidth, x, y }
    case EditorSplitDirection.Right:
      return { height, splitDirection, width: halfWidth, x: x + halfWidth, y }
    case EditorSplitDirection.Up:
      return { height: halfHeight, splitDirection, width, x, y }
    default:
      return { height, splitDirection, width, x, y }
  }
}
