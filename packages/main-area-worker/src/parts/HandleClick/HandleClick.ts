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
  return hasGroup && state.layout.activeGroupId !== groupId ? focusEditorGroup(state, groupId) : state
}

export const handleClickWithContext = async (context: AsyncCommandContext<MainAreaState>, name: string): Promise<void> => {
  await context.updateState((state) => handleClick(state, name))
}
