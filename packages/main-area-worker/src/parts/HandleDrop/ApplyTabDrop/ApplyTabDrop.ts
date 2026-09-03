import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../../EditorSplitDirection/EditorSplitDirection.ts'
import { moveTabToGroup } from '../../MoveTabToGroup/MoveTabToGroup.ts'
import { splitForDrop } from '../SplitForDrop/SplitForDrop.ts'

const getOpenTabCount = (state: MainAreaState): number => {
  return state.layout.groups.reduce((count, group) => count + group.tabs.length, 0)
}

export const applyTabDrop = (
  state: MainAreaState,
  sourceGroupId: number,
  tabId: number,
  splitDirection: number,
  targetGroupId?: number,
  targetIndex?: number,
): MainAreaState => {
  if (targetGroupId === undefined) {
    return state
  }
  if (splitDirection === EditorSplitDirection.None) {
    return moveTabToGroup(state, sourceGroupId, targetGroupId, tabId, targetIndex)
  }
  if (getOpenTabCount(state) === 1) {
    return state
  }
  const splitState = splitForDrop(state, splitDirection, targetGroupId)
  return moveTabToGroup(splitState, sourceGroupId, splitState.layout.activeGroupId, tabId)
}
