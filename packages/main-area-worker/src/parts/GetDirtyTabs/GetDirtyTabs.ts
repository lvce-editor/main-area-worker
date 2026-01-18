import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { getAllTabs } from '../GetAllTabs/GetAllTabs.ts'

export const getDirtyTabs = (state: MainAreaState): Tab[] => {
  return getAllTabs(state).filter((tab) => tab.isDirty)
}
