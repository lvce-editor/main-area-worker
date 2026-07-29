import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleDragLeave = (state: MainAreaState): MainAreaState => {
  if (!state.dragOverlay) {
    return state
  }
  return {
    ...state,
    dragOverlay: undefined,
  }
}
