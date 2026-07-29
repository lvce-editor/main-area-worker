import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const isEqual = (oldState: MainAreaState, newState: MainAreaState): boolean => {
  return oldState.dragOverlay === newState.dragOverlay && oldState.layout === newState.layout
}
