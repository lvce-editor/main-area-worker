import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const withGroups = (state: MainAreaState, groups: readonly EditorGroup[]): MainAreaState => {
  const { layout } = state
  return {
    ...state,
    layout: {
      ...layout,
      groups,
    },
  }
}
