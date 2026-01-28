import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const findTabInState = (state: MainAreaState, groupId: number, tabId: number): Tab | undefined => {
  const { layout } = state
  const group = layout.groups.find((g) => g.id === groupId)
  return group?.tabs.find((t) => t.id === tabId)
}

export const closeTab = (state: MainAreaState, groupId: number, tabId: number): MainAreaState => {
  const { layout } = state
  const { activeGroupId, groups } = layout

  const newGroups = groups.map((group) => {
    if (group.id === groupId) {
      const newTabs = group.tabs.filter((tab) => tab.id !== tabId)

      let newActiveTabId = group.activeTabId
      if (group.activeTabId === tabId) {
        const tabIndex = group.tabs.findIndex((tab) => tab.id === tabId)
        if (newTabs.length > 0) {
          newActiveTabId = newTabs[Math.min(tabIndex, newTabs.length - 1)].id
        } else {
          newActiveTabId = undefined
        }
      }

      return {
        ...group,
        activeTabId: newActiveTabId,
        tabs: newTabs,
      }
    }
    return group
  })

  // If the group has no tabs left and there are other groups, remove the group
  const groupWithNoTabs = newGroups.find((group) => group.id === groupId && group.tabs.length === 0)
  if (groupWithNoTabs && newGroups.length > 1) {
    const remainingGroups = newGroups.filter((group) => group.id !== groupId)

    const redistributedGroups = remainingGroups.map((group) => ({
      ...group,
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
