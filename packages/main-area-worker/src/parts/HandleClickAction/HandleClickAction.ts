import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeEditorGroup } from '../CloseEditorGroup/CloseEditorGroup.ts'
import { GetActiveGroup } from '../GetActiveGroup/GetActiveGroup.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import { splitEditorGroup } from '../SplitEditorGroup/SplitEditorGroup.ts'

export const handleClickAction = async (state: MainAreaState, action: string, rawGroupId?: string): Promise<MainAreaState> => {
  if (!action) {
    return state
  }

  if (state.layout.activeGroupId === undefined) {
    return state
  }

  const activeGroup = GetActiveGroup(state.layout.groups, state.layout.activeGroupId)
  if (!activeGroup) {
    return state
  }

  switch (action) {
    case 'close-group':
      if (rawGroupId) {
        const groupId = Number.parseInt(rawGroupId, 10)
        if (!Number.isNaN(groupId)) {
          return closeEditorGroup(state, groupId)
        }
      }
      return state
    case 'split-right':
      return splitEditorGroup(state, activeGroup.id, GroupDirection.Right)
    default:
      return state
  }
}
