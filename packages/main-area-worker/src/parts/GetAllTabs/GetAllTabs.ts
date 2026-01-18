import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const getAllTabs = (state: MainAreaState): Tab[] => {
  const { layout } = state
  const { groups } = layout
  return groups.flatMap((group) => group.tabs)
}
