import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleDragLeave = (state: MainAreaState): MainAreaState => {
  const { dragOverlay } = state
  if (!dragOverlay) {
    return state
  }
  return {
    ...state,
    dragOverlay: undefined,
  }
}
