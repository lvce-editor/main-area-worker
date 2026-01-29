import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const closeEditorGroup = (state: MainAreaState, groupId: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  const groupIndex = groups.findIndex((group) => group.id === groupId)
  if (groupIndex === -1 || groups.length <= 1) {
    return state
  }

  const remainingGroups = groups.filter((group) => group.id !== groupId)

  const baseSize = Math.floor(100 / remainingGroups.length)
  const remainder = 100 % remainingGroups.length

  const redistributedGroups = remainingGroups.map((group, index) => ({
    ...group,
    size: baseSize + (index === remainingGroups.length - 1 ? remainder : 0),
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
