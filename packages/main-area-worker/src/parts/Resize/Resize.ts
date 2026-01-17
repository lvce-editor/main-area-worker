import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const resize = (state: MainAreaState, dimensions: any): MainAreaState => {
  return {
    ...state,
    ...dimensions,
  }
}
