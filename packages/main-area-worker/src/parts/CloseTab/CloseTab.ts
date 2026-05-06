import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { addClosedTabs } from '../AddClosedTabs/AddClosedTabs.ts'
import { getGroupIndexById } from '../GetGroupIndexById/GetGroupIndexById.ts'
import { redistributeSizesWithRounding } from '../RedistributeSizesWithRounding/RedistributeSizesWithRounding.ts'
import { withEmptyGroups } from '../WithEmptyGroups/WithEmptyGroups.ts'
import { withGroups } from '../WithGroups/WithGroups.ts'
import { withGroupsAndActiveGroup } from '../WithGroupsAndActiveGroup/WithGroupsAndActiveGroup.ts'

export const closeTab = (state: MainAreaState, groupId: number, tabId: number): MainAreaState => {
  const { activeGroupId, groups } = state.layout

  // Find the group to close the tab from
  const groupIndex = getGroupIndexById(state, groupId)
  if (groupIndex === -1) {
    return state
  }

  const group = groups[groupIndex]
  const tabIndex = group.tabs.findIndex((tab) => tab.id === tabId)

  // Check if the tab exists in the group
  if (tabIndex === -1) {
    return state
  }

  const stateWithClosedTab = addClosedTabs(state, [
    {
      group,
      groupIndex,
      tab: group.tabs[tabIndex],
      tabIndex,
    },
  ])

  const newGroups = groups.map((grp) => {
    if (grp.id === groupId) {
      const newTabs = grp.tabs.filter((tab) => tab.id !== tabId)

      let newActiveTabId = grp.activeTabId
      if (grp.activeTabId === tabId) {
        if (newTabs.length > 0) {
          newActiveTabId = newTabs[Math.min(tabIndex, newTabs.length - 1)].id
        } else {
          newActiveTabId = undefined
        }
      }

      return {
        ...grp,
        activeTabId: newActiveTabId,
        isEmpty: newTabs.length === 0,
        tabs: newTabs,
      }
    }
    return grp
  })

  // If the group has no tabs left after closing, remove the group
  const groupIsNowEmpty = newGroups[groupIndex].tabs.length === 0
  if (groupIsNowEmpty) {
    const remainingGroups = newGroups.filter((group) => group.id !== groupId)

    // If there are remaining groups, redistribute sizes
    if (remainingGroups.length > 0) {
      const redistributedGroups = redistributeSizesWithRounding(remainingGroups)

      const newActiveGroupId = activeGroupId === groupId ? remainingGroups[0]?.id : activeGroupId

      return withGroupsAndActiveGroup(stateWithClosedTab, redistributedGroups, newActiveGroupId)
    }

    // If no remaining groups, return empty layout
    return withEmptyGroups(stateWithClosedTab)
  }

  return withGroups(stateWithClosedTab, newGroups)
}
