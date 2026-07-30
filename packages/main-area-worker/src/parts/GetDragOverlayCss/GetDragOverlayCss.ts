import type { DragOverlay } from '../MainAreaState/MainAreaState.ts'

export const getDragOverlayCss = (dragOverlay: DragOverlay | undefined): readonly string[] => {
  if (!dragOverlay) {
    return []
  }
  const { height, width, x, y } = dragOverlay
  return [
    `.DragOverlay {
  --DragOverlayLeft: ${x}px;
  --DragOverlayTop: ${y}px;
  --DragOverlayWidth: ${width}px;
  --DragOverlayHeight: ${height}px;
}`,
  ]
}
