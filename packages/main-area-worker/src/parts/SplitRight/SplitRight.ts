import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'

export const splitRight = (state: MainAreaState, groupId?: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout
  const targetGroupId = groupId ?? (activeGroupId ?? (groups[0]?.id ?? 0))
  return SplitEditorGroup.splitEditorGroup(state, targetGroupId, GroupDirection.Right)
}
