import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getGroupIndexById = (state: MainAreaState, groupId: number): number => {
  const { layout } = state
  const { groups } = layout
  return groups.findIndex((group) => group.id === groupId)
}
