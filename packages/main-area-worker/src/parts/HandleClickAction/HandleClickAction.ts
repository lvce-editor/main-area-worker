import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeEditorGroup } from '../CloseEditorGroup/CloseEditorGroup.ts'
import { GetActiveGroup } from '../GetActiveGroup/GetActiveGroup.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import { handleClickTogglePreview } from '../HandleClickTogglePreview/HandleClickTogglePreview.ts'
import { retryOpen } from '../RetryOpen/RetryOpen.ts'
import { splitEditorGroup } from '../SplitEditorGroup/SplitEditorGroup.ts'

export const handleClickAction = async (state: MainAreaState, action: string, rawGroupId?: string): Promise<MainAreaState> => {
  const { layout } = state
  const { activeGroupId, groups } = layout
  if (!action) {
    return state
  }

  if (activeGroupId === undefined) {
    return state
  }

  const activeGroup = GetActiveGroup(groups, activeGroupId)
  if (!activeGroup) {
    return state
  }

  switch (action) {
    case 'close-group':
      if (rawGroupId) {
        const groupId = Number.parseInt(rawGroupId, 10)
        return closeEditorGroup(state, groupId)
      }
      return state
    case 'retry-open':
      return retryOpen(state)
    case 'split-right':
      return splitEditorGroup(state, activeGroup.id, GroupDirection.Right)
    case 'toggle-preview':
      return handleClickTogglePreview(state)
    default:
      return state
  }
}
