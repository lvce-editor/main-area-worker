import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const findTabById = (state: MainAreaState, tabId: number): { tab: Tab; groupId: number } | undefined => {
  const { layout } = state
  const { groups } = layout
  for (const group of groups) {
    const tab = group.tabs.find((t) => t.id === tabId)
    if (tab) {
      return { groupId: group.id, tab }
    }
  }
  return undefined
}
