import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as MoveTabToGroup from '../MoveTabToGroup/MoveTabToGroup.ts'

export interface DragState {
  draggedTabId: string
  sourceGroupId: string
  targetGroupId?: string
  targetIndex?: number
}

export const startTabDrag = (
  state: MainAreaState,
  tabId: string,
  groupId: string,
): { readonly state: MainAreaState; readonly dragState: DragState } => {
  return {
    dragState: {
      draggedTabId: tabId,
      sourceGroupId: groupId,
    },
    state,
  }
}

export const updateTabDrag = (state: MainAreaState, dragState: DragState, targetGroupId: string, targetIndex: number): DragState => {
  return {
    ...dragState,
    targetGroupId,
    targetIndex,
  }
}

export const endTabDrag = (state: MainAreaState, dragState: DragState): MainAreaState => {
  if (dragState.targetGroupId && dragState.targetGroupId !== dragState.sourceGroupId) {
    return MoveTabToGroup.moveTabToGroup(state, dragState.sourceGroupId, dragState.targetGroupId, dragState.draggedTabId, dragState.targetIndex)
  }

  return state
}
