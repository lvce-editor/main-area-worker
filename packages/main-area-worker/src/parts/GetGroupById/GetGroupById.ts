import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getGroupById = (state: MainAreaState, groupId: number): EditorGroup | undefined => {
  const { layout } = state
  return layout.groups.find((group) => group.id === groupId)
}
