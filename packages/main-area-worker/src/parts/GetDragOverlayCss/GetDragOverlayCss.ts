import type { DragOverlay } from '../MainAreaState/MainAreaState.ts'

export const getDragOverlayCss = (dragOverlay: DragOverlay | undefined): readonly string[] => {
  if (!dragOverlay) {
    return []
  }
  const { height, width, x, y } = dragOverlay
  return [
    `.DragOverlay {
  left: ${x}px;
  top: ${y}px;
  width: ${width}px;
  height: ${height}px;
}`,
  ]
}
