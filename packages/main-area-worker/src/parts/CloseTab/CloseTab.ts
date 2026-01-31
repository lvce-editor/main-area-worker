import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const findTabInState = (state: MainAreaState, groupId: number, tabId: number): Tab | undefined => {
  const { layout } = state
  const group = layout.groups.find((g) => g.id === groupId)
  return group?.tabs.find((t) => t.id === tabId)
}

export const closeTab = (state: MainAreaState, groupId: number, tabId: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  // Find the group to close the tab from
  const groupIndex = groups.findIndex((g) => g.id === groupId)
  if (groupIndex === -1) {
    return state
  }

  const group = groups[groupIndex]
  // Check if the tab exists in the group
  const tabWasRemoved = group.tabs.some((tab) => tab.id === tabId)
  if (!tabWasRemoved) {
    return state
  }

  const newGroups = groups.map((grp) => {
    if (grp.id === groupId) {
      const newTabs = grp.tabs.filter((tab) => tab.id !== tabId)

      let newActiveTabId = grp.activeTabId
      if (grp.activeTabId === tabId) {
        const tabIndex = grp.tabs.findIndex((tab) => tab.id === tabId)
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
      const redistributedGroups = remainingGroups.map((grp) => ({
        ...grp,
        size: Math.round(100 / remainingGroups.length),
      }))

      const newActiveGroupId = activeGroupId === groupId ? remainingGroups[0]?.id : activeGroupId

      return {
        ...state,
        layout: {
          ...layout,
          activeGroupId: newActiveGroupId,
          groups: redistributedGroups,
        },
      }
    }

    // If no remaining groups, return empty layout
    return {
      ...state,
      layout: {
        ...layout,
        activeGroupId: undefined,
        groups: [],
      },
    }
  }

  return {
    ...state,
    layout: {
      ...layout,
      groups: newGroups,
    },
  }
}

/**
 * Close tab with viewlet disposal.
 * This is the async version that handles viewlet lifecycle.
 */
export const closeTabWithViewlet = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  // Get the tab before closing to check for viewlet
  const tab = findTabInState(state, groupId, tabId)
  const commands: ViewletCommand[] = []

  // Dispose viewlet if present and not idle
  if (tab && tab.editorUid !== undefined) {
    const { commands: disposeCommands } = ViewletLifecycle.disposeViewletForTab(state, tabId)
    commands.push(...disposeCommands)
  }

  // Close the tab (pure state update)
  const newState = closeTab(state, groupId, tabId)

  // Check if we need to attach a new viewlet (if we closed the active tab)
  const group = state.layout.groups.find((g) => g.id === groupId)
  const wasActiveTab = group?.activeTabId === tabId
  if (wasActiveTab) {
    const newGroup = newState.layout.groups.find((g) => g.id === groupId)
    const newActiveTabId = newGroup?.activeTabId
    if (newActiveTabId !== undefined) {
      // Switch viewlet to the new active tab
      const { commands: switchCommands, newState: switchedState } = ViewletLifecycle.switchViewlet(newState, undefined, newActiveTabId)
      commands.push(...switchCommands)
      await ExecuteViewletCommands.executeViewletCommands(commands)
      return switchedState
    }
  }

  // Execute any disposal commands
  if (commands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(commands)
  }

  return newState
}
