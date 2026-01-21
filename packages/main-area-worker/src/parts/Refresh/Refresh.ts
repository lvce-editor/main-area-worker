import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const refresh = (state: MainAreaState): MainAreaState => {
  return { ...state }
}
