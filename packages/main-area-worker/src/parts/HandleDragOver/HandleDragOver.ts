import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getDragOverlay } from '../GetDragOverlay/GetDragOverlay.ts'

const isEqual = (oldOverlay: MainAreaState['dragOverlay'], newOverlay: MainAreaState['dragOverlay']): boolean => {
  return (
    oldOverlay?.x === newOverlay?.x &&
    oldOverlay?.y === newOverlay?.y &&
    oldOverlay?.width === newOverlay?.width &&
    oldOverlay?.height === newOverlay?.height &&
    oldOverlay?.splitDirection === newOverlay?.splitDirection
  )
}

export const handleDragOver = (state: MainAreaState, eventX: number, eventY: number): MainAreaState => {
  const { dragOverlay: oldDragOverlay } = state
  const dragOverlay = getDragOverlay(state, eventX, eventY)
  if (isEqual(oldDragOverlay, dragOverlay)) {
    return state
  }
  return {
    ...state,
    dragOverlay,
  }
}
