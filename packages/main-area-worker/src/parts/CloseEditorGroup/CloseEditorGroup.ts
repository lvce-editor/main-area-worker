import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { collapseSingleGroupSegments } from '../CollapseSingleGroupSegments/CollapseSingleGroupSegments.ts'
import { getGroupIndexById } from '../GetGroupIndexById/GetGroupIndexById.ts'
import { redistributeSizesWithRemainder } from '../RedistributeSizesWithRemainder/RedistributeSizesWithRemainder.ts'
import { withGroupsAndActiveGroup } from '../WithGroupsAndActiveGroup/WithGroupsAndActiveGroup.ts'

export const closeEditorGroup = (state: MainAreaState, groupId: number): MainAreaState => {
  if (Number.isNaN(groupId)) {
    return state
  }

  const { layout } = state
  const { activeGroupId, direction, groups } = layout

  const groupIndex = getGroupIndexById(state, groupId)
  if (groupIndex === -1 || groups.length <= 1) {
    return state
  }

  const remainingGroups = groups.filter((group) => group.id !== groupId)
  const redistributedGroups = collapseSingleGroupSegments(redistributeSizesWithRemainder(remainingGroups), direction)

  const newActiveGroupId = activeGroupId === groupId ? remainingGroups[0].id : activeGroupId

  return withGroupsAndActiveGroup(state, redistributedGroups, newActiveGroupId)
}
