import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'

export const splitDown = (state: MainAreaState, groupId?: number): MainAreaState => {
  const resolvedGroupId = groupId ?? state.layout.activeGroupId
  if (!resolvedGroupId) {
    return state
  }
  return SplitEditorGroup.splitEditorGroup(state, resolvedGroupId, 'down')
}
