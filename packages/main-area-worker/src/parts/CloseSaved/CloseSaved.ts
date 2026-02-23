import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { withGroups } from '../WithGroups/WithGroups.ts'

const getNextActiveTabId = (tabs: readonly Tab[], newTabs: readonly Tab[], activeTabId: number | undefined): number | undefined => {
  if (activeTabId === undefined) {
    return undefined
  }
  if (newTabs.some((tab) => tab.id === activeTabId)) {
    return activeTabId
  }
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTabId)
  if (activeTabIndex === -1 || newTabs.length === 0) {
    return undefined
  }
  return newTabs[Math.min(activeTabIndex, newTabs.length - 1)].id
}

const closeSavedInGroup = (group: EditorGroup): EditorGroup => {
  const { activeTabId, tabs } = group
  const newTabs = tabs.filter((tab) => tab.isDirty)
  if (newTabs.length === tabs.length) {
    return group
  }
  const newActiveTabId = getNextActiveTabId(tabs, newTabs, activeTabId)
  return {
    ...group,
    activeTabId: newActiveTabId,
    isEmpty: newTabs.length === 0,
    tabs: newTabs,
  }
}

export const closeSaved = (state: MainAreaState): MainAreaState => {
  const { groups } = state.layout
  const newGroups = groups.map(closeSavedInGroup)
  return withGroups(state, newGroups)
}
