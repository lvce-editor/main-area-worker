import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeAll = (state: MainAreaState): MainAreaState => {
  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId: undefined,
      groups: [],
    },
  }
}
