import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const getGroupIndexById = (state: MainAreaState, groupId: number): number => {
  return state.layout.groups.findIndex((group) => group.id === groupId)
}
