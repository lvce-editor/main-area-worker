import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const focusEditorGroup = (state: MainAreaState, groupId: number): MainAreaState => {
  const groups = state.layout.groups.map((group) => ({
    ...group,
    focused: group.id === groupId,
  }))

  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId: groupId,
      groups,
    },
  }
}
