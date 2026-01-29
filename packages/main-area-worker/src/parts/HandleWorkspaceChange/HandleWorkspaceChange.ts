import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleWorkspaceChange = (state: MainAreaState): MainAreaState => {
  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId: undefined,
      groups: [],
    },
  }
}
