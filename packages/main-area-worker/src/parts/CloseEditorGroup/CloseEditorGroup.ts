import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeEditorGroup = (state: MainAreaState, groupId: string): MainAreaState => {
  const groupIndex = state.layout.groups.findIndex((group) => group.id === groupId)
  if (groupIndex === -1 || state.layout.groups.length <= 1) {
    return state
  }

  const remainingGroups = state.layout.groups.filter((group) => group.id !== groupId)

  const redistributedGroups = remainingGroups.map((group, index) => ({
    ...group,
    size: Math.round(100 / remainingGroups.length),
  }))

  const newActiveGroupId = state.layout.activeGroupId === groupId ? remainingGroups[0].id : state.layout.activeGroupId

  return {
    ...state,
    layout: {
      ...state.layout,
      activeGroupId: newActiveGroupId,
      groups: redistributedGroups,
    },
  }
}
