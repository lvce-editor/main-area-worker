import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const focusEditorGroup = (state: MainAreaState, groupId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout
  const updatedGroups = groups.map((group) => ({
    ...group,
    focused: group.id === groupId,
  }))

  return {
    ...state,
    layout: {
      ...layout,
      activeGroupId: groupId,
      groups: updatedGroups,
    },
  }
}
