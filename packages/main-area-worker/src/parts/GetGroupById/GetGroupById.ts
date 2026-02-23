import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getGroupById = (state: MainAreaState, groupId: number): EditorGroup | undefined => {
  return state.layout.groups.find((group) => group.id === groupId)
}
