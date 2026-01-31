import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as GroupDirection from '../GroupDirection/GroupDirection.ts'
import * as Id from '../Id/Id.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'

export const splitRight = (state: MainAreaState, groupId?: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  // If there are no groups, create an initial empty group first
  if (groups.length === 0) {
    const initialGroupId = Id.create()
    const initialGroup: EditorGroup = {
      activeTabId: undefined,
      focused: true,
      id: initialGroupId,
      isEmpty: true,
      size: 100,
      tabs: [],
    }
    const stateWithInitialGroup = {
      ...state,
      layout: {
        ...layout,
        activeGroupId: initialGroupId,
        groups: [initialGroup],
      },
    }
    return SplitEditorGroup.splitEditorGroup(stateWithInitialGroup, initialGroupId, GroupDirection.Right)
  }

  const targetGroupId = groupId ?? activeGroupId ?? groups[0]?.id ?? 0
  return SplitEditorGroup.splitEditorGroup(state, targetGroupId, GroupDirection.Right)
}
