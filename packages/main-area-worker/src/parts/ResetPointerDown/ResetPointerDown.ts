import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const resetPointerDown = (state: MainAreaState): MainAreaState => {
  if (state.pointerDownGroupIndex === -1 && state.pointerDownTabIndex === -1) {
    return state
  }
  return {
    ...state,
    pointerDownGroupIndex: -1,
    pointerDownTabIndex: -1,
  }
}
