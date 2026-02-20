import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const isEqual = (oldState: MainAreaState, newState: MainAreaState): boolean => {
  return oldState.width === newState.width && oldState.height === newState.height
}
