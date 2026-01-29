import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'

export const splitRight = (state: MainAreaState, groupId: number): MainAreaState => {
  return SplitEditorGroup.splitEditorGroup(state, groupId, GroupDirection.Right)
}
