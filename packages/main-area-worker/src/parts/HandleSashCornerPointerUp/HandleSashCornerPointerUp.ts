import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleSashCornerPointerUp = async (state: MainAreaState): Promise<MainAreaState> => {
  const { sashCornerDrag } = state
  if (!sashCornerDrag) {
    return state
  }
  return {
    ...state,
    sashCornerDrag: undefined,
  }
}
