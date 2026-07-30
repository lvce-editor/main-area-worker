import type { Tab } from '../Tab/Tab.ts'

export const getAllTabs = (layout: any): readonly Tab[] => {
  const { groups } = layout
  const allTabs: Tab[] = []
  for (const group of groups) {
    allTabs.push(...group.tabs)
  }
  return allTabs
}
