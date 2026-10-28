import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const isEqual = (oldState: MainAreaState, newState: MainAreaState): boolean => {
  return (
    !oldState.initial &&
    oldState.layout === newState.layout &&
    oldState.width === newState.width &&
    oldState.dragOverlay === newState.dragOverlay &&
    oldState.tabHeight === newState.tabHeight
  )
}
