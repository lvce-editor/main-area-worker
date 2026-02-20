import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import * as CloseTab from '../CloseTab/CloseTab.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import * as FindTabInState from '../FindTabInState/FindTabInState.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const closeTabWithViewlet = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  const tab = FindTabInState.findTabInState(state, groupId, tabId)
  const commands: ViewletCommand[] = []

  if (tab && tab.editorUid !== undefined) {
    const { commands: disposeCommands } = ViewletLifecycle.disposeViewletForTab(state, tabId)
    commands.push(...disposeCommands)
  }

  const newState = CloseTab.closeTab(state, groupId, tabId)

  const group = state.layout.groups.find((g) => g.id === groupId)
  const wasActiveTab = group?.activeTabId === tabId
  if (wasActiveTab) {
    const newGroup = newState.layout.groups.find((g) => g.id === groupId)
    const newActiveTabId = newGroup?.activeTabId
    if (newActiveTabId !== undefined) {
      const { commands: switchCommands, newState: switchedState } = ViewletLifecycle.switchViewlet(newState, undefined, newActiveTabId)
      commands.push(...switchCommands)
      await ExecuteViewletCommands.executeViewletCommands(commands)
      return switchedState
    }
  }

  if (commands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(commands)
  }

  return newState
}
