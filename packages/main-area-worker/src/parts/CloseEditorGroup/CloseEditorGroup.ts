import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeEditorGroup = (state: MainAreaState, groupId: string): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  const groupIndex = groups.findIndex((group) => group.id === groupId)
  if (groupIndex === -1 || groups.length <= 1) {
    return state
  }

  const remainingGroups = groups.filter((group) => group.id !== groupId)

  const redistributedGroups = remainingGroups.map((group, index) => ({
    ...group,
    size: Math.round(100 / remainingGroups.length),
  }))

  const newActiveGroupId = activeGroupId === groupId ? remainingGroups[0].id : activeGroupId

  return {
    ...state,
    layout: {
      ...layout,
      activeGroupId: newActiveGroupId,
      groups: redistributedGroups,
    },
  }
}
