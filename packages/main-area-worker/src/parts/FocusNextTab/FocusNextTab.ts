import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

export const focusNextTab = async (state: MainAreaState): Promise<MainAreaState> => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  // Find the active group
  const activeGroup = groups.find((g) => g.id === activeGroupId)
  if (!activeGroup || activeGroup.isEmpty) {
    return state
  }

  // Find the index of the active group
  const activeGroupIndex = groups.findIndex((g) => g.id === activeGroupId)
  if (activeGroupIndex === -1) {
    return state
  }

  // Find the current active tab index
  const activeTabIndex = activeGroup.tabs.findIndex((t) => t.id === activeGroup.activeTabId)
  if (activeTabIndex === -1) {
    return state
  }

  // If not at the last tab, select the next tab, otherwise cycle to first
  const nextTabIndex = activeTabIndex < activeGroup.tabs.length - 1 ? activeTabIndex + 1 : 0
  return selectTab(state, activeGroupIndex, nextTabIndex)
}
