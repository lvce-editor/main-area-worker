import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const resetPointerDown = (state: MainAreaState): MainAreaState => {
  if (state.pointerDownGroupIndex === -1 && state.pointerDownTabIndex === -1 && !state.dragOverlay && !state.tabDropIndicator) {
    return state
  }
  return {
    ...state,
    dragOverlay: undefined,
    pointerDownGroupIndex: -1,
    pointerDownTabIndex: -1,
    tabDropIndicator: undefined,
  }
}
