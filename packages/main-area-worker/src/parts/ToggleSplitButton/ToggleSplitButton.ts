import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const toggleSplitButton = (state: MainAreaState, visible: boolean): MainAreaState => {
  return {
    ...state,
    splitButtonEnabled: visible,
  }
}
