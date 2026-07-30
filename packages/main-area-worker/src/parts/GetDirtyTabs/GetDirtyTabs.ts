import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { getAllTabs } from '../GetAllTabs/GetAllTabs.ts'

const isDirty = (tab: Tab): boolean => {
  return tab.isDirty
}

export const getDirtyTabs = (state: MainAreaState): Tab[] => {
  return getAllTabs(state).filter(isDirty)
}
