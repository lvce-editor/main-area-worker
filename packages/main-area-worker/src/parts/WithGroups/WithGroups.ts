import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const withGroups = (state: MainAreaState, groups: readonly EditorGroup[]): MainAreaState => {
  return {
    ...state,
    layout: {
      ...state.layout,
      groups,
    },
  }
}
