import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const isEqual = (oldState: MainAreaState, newState: MainAreaState): boolean => {
  return oldState.statusBarItemsLeft === newState.statusBarItemsLeft && oldState.statusBarItemsRight === newState.statusBarItemsRight
}
