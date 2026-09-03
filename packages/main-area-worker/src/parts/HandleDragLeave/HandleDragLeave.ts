import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleDragLeave = (state: MainAreaState): MainAreaState => {
  const { dragOverlay, tabDropIndicator } = state
  if (!dragOverlay && !tabDropIndicator) {
    return state
  }
  return {
    ...state,
    dragOverlay: undefined,
    tabDropIndicator: undefined,
  }
}
