import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleSashPointerUp = async (state: MainAreaState): Promise<MainAreaState> => {
  const { sashDrag } = state
  if (!sashDrag) {
    return state
  }
  return {
    ...state,
    sashDrag: undefined,
  }
}
