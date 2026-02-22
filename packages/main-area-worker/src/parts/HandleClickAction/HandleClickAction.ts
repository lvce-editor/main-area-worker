import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeEditorGroup } from '../CloseEditorGroup/CloseEditorGroup.ts'
import { getActiveGroup } from '../GetActiveGroup/GetActiveGroup.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import { handleClickTogglePreview } from '../HandleClickTogglePreview/HandleClickTogglePreview.ts'
import * as InputName from '../InputName/InputName.ts'
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

  const activeGroup = getActiveGroup(groups, activeGroupId)
  if (!activeGroup) {
    return state
  }

  switch (action) {
    case InputName.CloseGroup:
      if (rawGroupId) {
        const groupId = Number.parseInt(rawGroupId, 10)
        return closeEditorGroup(state, groupId)
      }
      return state
    case InputName.RetryOpen:
      return retryOpen(state)
    case InputName.SplitRight:
      return splitEditorGroup(state, activeGroup.id, GroupDirection.Right)
    case InputName.TogglePreview:
      return handleClickTogglePreview(state)
    default:
      return state
  }
}
