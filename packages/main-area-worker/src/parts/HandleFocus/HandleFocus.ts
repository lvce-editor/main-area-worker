import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { parseRawGroupId } from '../ParseRawGroupId/ParseRawGroupId.ts'

export const handleFocus = (state: MainAreaState, rawGroupId?: string): MainAreaState => {
  const groupId = parseRawGroupId(rawGroupId)
  if (groupId === undefined) {
    return state
  }
  const hasGroup = state.layout.groups.some((currentGroup) => currentGroup.id === groupId)
  if (!hasGroup) {
    return state
  }
  return focusEditorGroup(state, groupId)
}
