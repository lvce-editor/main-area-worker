import type { MainAreaState, Tab } from '../../MainAreaState/MainAreaState.ts'
import { createViewlet } from '../../CreateViewlet/CreateViewlet.ts'
import * as ExecuteViewletCommands from '../../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import { findTabById } from '../../FindTabById/FindTabById.ts'
import * as MainAreaStates from '../../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../../ViewletLifecycle/ViewletLifecycle.ts'
import { getSelectedTabBounds } from '../GetSelectedTabBounds/GetSelectedTabBounds.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import { maybeStartLoading } from '../MaybeStartLoading/MaybeStartLoading.ts'
import { shouldCreateViewletForSelectedTab } from '../ShouldCreateViewletForSelectedTab/ShouldCreateViewletForSelectedTab.ts'

export const maybeCreateViewletForSelectedTab = async (
  state: MainAreaState,
  newState: MainAreaState,
  groupIndex: number,
  index: number,
  tabId: number,
  tab: Tab,
  uid: number,
  needsLoading: boolean,
  requestId: number,
  switchCommands: readonly any[],
): Promise<MainAreaState | undefined> => {
  const selectedTab = newState.layout.groups[groupIndex].tabs[index]
  if (!shouldCreateViewletForSelectedTab(selectedTab)) {
    return undefined
  }

  const viewletModuleId = await getViewletModuleId(selectedTab)
  if (!viewletModuleId) {
    return undefined
  }

  const bounds = getSelectedTabBounds(newState)
  let stateWithViewlet = ViewletLifecycle.createViewletForTab(newState, tabId, viewletModuleId, bounds)
  MainAreaStates.set(uid, state, stateWithViewlet)

  if (switchCommands.length > 0) {
    await ExecuteViewletCommands.executeViewletCommands(switchCommands)
  }

  const tabWithViewlet = findTabById(stateWithViewlet, tabId)
  if (tabWithViewlet) {
    const { editorUid } = tabWithViewlet.tab
    if (editorUid !== -1 && selectedTab.uri) {
      await createViewlet(viewletModuleId, editorUid, tabId, bounds, selectedTab.uri)
      stateWithViewlet = ViewletLifecycle.handleViewletReady(stateWithViewlet, editorUid)
      MainAreaStates.set(uid, state, stateWithViewlet)
    }
  }

  return maybeStartLoading(state, stateWithViewlet, tabId, tab, needsLoading, requestId)
}
