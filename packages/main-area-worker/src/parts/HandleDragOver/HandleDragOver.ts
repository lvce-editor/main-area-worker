import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getDragOverlay } from '../GetDragOverlay/GetDragOverlay.ts'
import { isDragOverlayEqual } from '../IsDragOverlayEqual/IsDragOverlayEqual.ts'

export const handleDragOver = (state: MainAreaState, eventX: number, eventY: number): MainAreaState => {
  const { dragOverlay: oldDragOverlay } = state
  const dragOverlay = getDragOverlay(state, eventX, eventY)
  if (isDragOverlayEqual(oldDragOverlay, dragOverlay)) {
    return state
  }
  return {
    ...state,
    dragOverlay,
  }
}
