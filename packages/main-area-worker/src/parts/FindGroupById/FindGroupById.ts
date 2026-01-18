import type { MainAreaState, EditorGroup } from '../MainAreaState/MainAreaState.ts'

export const findGroupById = (state: MainAreaState, groupId: number): EditorGroup | undefined => {
  const { layout } = state
  const { groups } = layout
  return groups.find((group) => group.id === groupId)
}
