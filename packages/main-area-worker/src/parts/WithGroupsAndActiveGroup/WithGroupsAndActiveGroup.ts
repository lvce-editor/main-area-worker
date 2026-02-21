import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const withGroupsAndActiveGroup = (state: MainAreaState, groups: readonly EditorGroup[], activeGroupId: number | undefined): MainAreaState => {
  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId,
      groups,
    },
  }
}
