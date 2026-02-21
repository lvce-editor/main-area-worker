import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getFocusedGroup = (state: MainAreaState): EditorGroup | undefined => {
  return state.layout.groups.find((group) => group.focused)
}
