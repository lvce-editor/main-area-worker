import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { parseRawGroupId } from '../ParseRawGroupId/ParseRawGroupId.ts'

export const handleClick = async (state: MainAreaState, name: string): Promise<MainAreaState> => {
  const groupId = parseRawGroupId(name)
  if (groupId === undefined) {
    return state
  }
  const hasGroup = state.layout.groups.some((group) => group.id === groupId)
  return hasGroup ? focusEditorGroup(state, groupId) : state
}
