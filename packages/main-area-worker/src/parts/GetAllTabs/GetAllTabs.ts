import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

const getTabs = (group: EditorGroup): readonly Tab[] => {
  return group.tabs
}

export const getAllTabs = (state: MainAreaState): Tab[] => {
  const { layout } = state
  const { groups } = layout
  return groups.flatMap(getTabs)
}
