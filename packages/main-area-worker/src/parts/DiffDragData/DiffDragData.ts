import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const isEqual = (oldState: MainAreaState, newState: MainAreaState): boolean => {
  return oldState.pointerDownGroupIndex === newState.pointerDownGroupIndex && oldState.pointerDownTabIndex === newState.pointerDownTabIndex
}
