import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const withGroupsAndActiveGroup = (state: MainAreaState, groups: readonly EditorGroup[], activeGroupId: number): MainAreaState => {
  const { layout } = state
  return {
    ...state,
    layout: {
      ...layout,
      activeGroupId,
      groups,
    },
  }
}
