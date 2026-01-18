import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'

export const saveState = (state: MainAreaState): SavedState => {
  const { layout } = state
  return {
    layout,
  }
}
