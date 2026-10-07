import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { parseRawGroupId } from '../ParseRawGroupId/ParseRawGroupId.ts'

export const handleClick = (state: MainAreaState, name: string): MainAreaState => {
  const groupId = parseRawGroupId(name)
  if (groupId === undefined) {
    return state
  }
  const hasGroup = state.layout.groups.some((group) => group.id === groupId)
  // Empty-group focus must publish a fresh layout even when this group is already active.
  return hasGroup ? focusEditorGroup(state, groupId) : state
}

export const handleGroupMouseDown = async (context: AsyncCommandContext<MainAreaState>, name: string): Promise<void> => {
  const groupId = parseRawGroupId(name)
  await context.updateState((state) => (state.layout.activeGroupId === groupId ? state : handleClick(state, name)))
}
