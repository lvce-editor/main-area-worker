import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import * as CloseTab from '../CloseTab/CloseTab.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import * as FindTabInState from '../FindTabInState/FindTabInState.ts'
import { disposeViewletForTab } from '../ViewletLifecycle/DisposeViewletForTab/DisposeViewletForTab.ts'

export const closeTabWithViewlet = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  const tab = FindTabInState.findTabInState(state, groupId, tabId)
  const commands: ViewletCommand[] = []

  if (tab && tab.editorUid !== -1) {
    const { commands: disposeCommands } = disposeViewletForTab(state, tabId)
    commands.push(...disposeCommands)
  }

  const newState = CloseTab.closeTab(state, groupId, tabId)

  const group = state.layout.groups.find((g) => g.id === groupId)
  const wasActiveTab = group?.activeTabId === tabId
  const newGroup = wasActiveTab ? newState.layout.groups.find((candidate) => candidate.id === groupId) : undefined
  const newActiveTabId = newGroup?.activeTabId
  if (wasActiveTab && commands.length > 0) {
    if (newActiveTabId === undefined) {
      return {
        ...newState,
        pendingViewletUpdate: {
          disposal: tab!.editorUid,
        },
      }
    }

    const newActiveTab = newGroup?.tabs.find((candidate) => candidate.id === newActiveTabId)
    return {
      ...newState,
      pendingViewletUpdate: {
        disposal: tab!.editorUid,
        focus: newActiveTab?.editorUid === -1 ? undefined : newActiveTab?.editorUid,
      },
    }
  }

  if (commands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(commands)
  }
  return newState
}
