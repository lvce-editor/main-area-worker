import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleSashCornerPointerUp = async (state: MainAreaState): Promise<MainAreaState> => {
  if (!state.sashCornerDrag) {
    return state
  }
  return {
    ...state,
    sashCornerDrag: undefined,
  }
}
