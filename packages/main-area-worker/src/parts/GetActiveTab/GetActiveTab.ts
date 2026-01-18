import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const getActiveTab = (state: MainAreaState): { tab: Tab; groupId: number } | undefined => {
  const { layout } = state
  const { groups } = layout
  const activeGroup = groups.find((group) => group.focused)
  if (!activeGroup || !activeGroup.activeTabId) {
    return undefined
  }

  const activeTab = activeGroup.tabs.find((tab) => tab.id === activeGroup.activeTabId)
  if (!activeTab) {
    return undefined
  }

  return { groupId: activeGroup.id, tab: activeTab }
}
