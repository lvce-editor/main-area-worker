import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import * as ExecuteViewletCommands from '../../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import * as GetNextRequestId from '../../GetNextRequestId/GetNextRequestId.ts'
import * as MainAreaStates from '../../MainAreaStates/MainAreaStates.ts'
import { shouldLoadContentForTab } from '../../ShouldLoadContentForTab/ShouldLoadContentForTab.ts'
import * as ViewletLifecycle from '../../ViewletLifecycle/ViewletLifecycle.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getSelectedTabData } from '../GetSelectedTabData/GetSelectedTabData.ts'
import { getUpdatedGroups } from '../GetUpdatedGroups/GetUpdatedGroups.ts'
import { maybeCreateViewletForSelectedTab } from '../MaybeCreateViewletForSelectedTab/MaybeCreateViewletForSelectedTab.ts'
import { maybeStartLoading } from '../MaybeStartLoading/MaybeStartLoading.ts'

export const selectTab = async (state: MainAreaState, groupIndex: number, index: number): Promise<MainAreaState> => {
  const { layout, uid } = state
  const { groups } = layout

  if (groupIndex < 0 || groupIndex >= groups.length) {
    return state
  }

  const selectedTabData = getSelectedTabData(state, groupIndex, index)
  if (!selectedTabData) {
    return state
  }

  const { group, groupId, tab, tabId } = selectedTabData
  const isAlreadyActive = layout.activeGroupId === groupId && group.activeTabId === tabId

  if (isAlreadyActive && !shouldLoadContentForTab(tab)) {
    return state
  }

  const previousTabId = getActiveTabId(state)
  const needsLoading = shouldLoadContentForTab(tab)
  const requestId = needsLoading ? GetNextRequestId.getNextRequestId() : 0
  const updatedGroups = getUpdatedGroups(groups, groupIndex, needsLoading, tabId)

  let newState: MainAreaState = {
    ...state,
    layout: {
      ...layout,
      activeGroupId: groupId,
      groups: updatedGroups,
    },
  }

  const { commands: switchCommands, newState: stateWithViewlet } = ViewletLifecycle.switchViewlet(newState, previousTabId, tabId)
  newState = stateWithViewlet

  const maybeCreatedState = await maybeCreateViewletForSelectedTab(
    state,
    newState,
    groupIndex,
    index,
    tabId,
    tab,
    uid,
    needsLoading,
    requestId,
    switchCommands,
  )
  if (maybeCreatedState) {
    return maybeCreatedState
  }

  MainAreaStates.set(uid, state, newState)

  if (switchCommands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(switchCommands)
  }

  return maybeStartLoading(state, newState, tabId, tab, needsLoading, requestId)
}
