import type { Tab } from '../Tab/Tab.ts'

export const getAllTabs = (layout: any): readonly Tab[] => {
  const allTabs: Tab[] = []
  for (const group of layout.groups) {
    allTabs.push(...group.tabs)
  }
  return allTabs
}
