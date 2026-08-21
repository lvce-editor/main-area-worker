import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const isDragOverlayEqual = (oldOverlay: MainAreaState['dragOverlay'], newOverlay: MainAreaState['dragOverlay']): boolean => {
  return (
    oldOverlay?.x === newOverlay?.x &&
    oldOverlay?.y === newOverlay?.y &&
    oldOverlay?.width === newOverlay?.width &&
    oldOverlay?.height === newOverlay?.height &&
    oldOverlay?.splitDirection === newOverlay?.splitDirection &&
    oldOverlay?.targetGroupId === newOverlay?.targetGroupId
  )
}
