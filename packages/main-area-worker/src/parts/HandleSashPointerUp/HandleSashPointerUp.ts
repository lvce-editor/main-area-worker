import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleSashPointerUp = async (state: MainAreaState): Promise<MainAreaState> => {
  if (!state.sashDrag) {
    return state
  }
  return {
    ...state,
    sashDrag: undefined,
  }
}
