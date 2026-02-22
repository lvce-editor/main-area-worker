import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const handleWorkspaceChange = (state: MainAreaState): MainAreaState => {
  const { layout } = state
  return {
    ...state,
    layout: {
      ...layout,
      activeGroupId: undefined,
      groups: [],
    },
  }
}
