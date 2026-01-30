import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'
import * as Id from '../Id/Id.ts'

export const splitDown = (state: MainAreaState, groupId?: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  // If there are no groups, create an initial empty group first
  if (groups.length === 0) {
    const initialGroupId = Id.create()
    const initialGroup: EditorGroup = {
      activeTabId: undefined,
      focused: true,
      id: initialGroupId,
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
    return SplitEditorGroup.splitEditorGroup(stateWithInitialGroup, initialGroupId, 'down')
  }

  const resolvedGroupId = groupId ?? state.layout.activeGroupId
  if (!resolvedGroupId) {
    return state
  }
  return SplitEditorGroup.splitEditorGroup(state, resolvedGroupId, 'down')
}
