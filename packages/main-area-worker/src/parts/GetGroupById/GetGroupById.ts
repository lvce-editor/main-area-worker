import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getGroupById = (state: MainAreaState, groupId: number): EditorGroup | undefined => {
  const { layout } = state
  const { groups } = layout
  return groups.find((group) => group.id === groupId)
}
