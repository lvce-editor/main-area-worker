import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { GetActiveGroup } from '../GetActiveGroup/GetActiveGroup.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import { splitEditorGroup } from '../SplitEditorGroup/SplitEditorGroup.ts'

export const handleClickAction = async (state: MainAreaState, action: string): Promise<MainAreaState> => {
  if (!action) {
    return state
  }

  const activeGroup = GetActiveGroup(state.layout.groups, state.layout.activeGroupId)
  if (!activeGroup) {
    return state
  }

  switch (action) {
    case 'split-right':
      return splitEditorGroup(state, activeGroup.id, GroupDirection.Right)
    default:
      return state
  }
}
