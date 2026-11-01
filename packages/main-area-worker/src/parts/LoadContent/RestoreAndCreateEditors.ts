import type { MainAreaLayout, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../Tab/Tab.ts'
import { createViewlets } from '../CreateViewlets/CreateViewlets.ts'
import { getViewletModuleIds } from '../GetViewletModuleIds/GetViewletModuleIds.ts'
import * as Id from '../Id/Id.ts'
import { getSelectedTabBounds } from '../SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'
import { updateTabs } from '../UpdateTabs/UpdateTabs.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const restoreAndCreateEditors = async (state: MainAreaState, restoredLayout: MainAreaLayout): Promise<MainAreaState> => {
  // Saved tab/group IDs can overlap the range assigned to a fresh renderer.
  // Reserve them before creating editors or opening any additional tabs.
  Id.reserve(restoredLayout.groups.flatMap((group) => [group.id, ...group.tabs.map((tab) => tab.id)]))
  let newState: MainAreaState = {
    ...state,
    layout: restoredLayout,
  }

  // Get viewlet module IDs for all active tabs
  const viewletModuleIds = await getViewletModuleIds(newState.layout, state.applicationId)

  // Create viewlets and get editor UIDs
  const { editorUids, titles } = await createViewlets(newState, viewletModuleIds)

  // Update tabs with editor UIDs
  newState = updateTabs(newState, editorUids)

  // Create viewlets in the lifecycle and mark them as ready
  for (const group of newState.layout.groups) {
    const activeTab = group.tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && viewletModuleIds[activeTab.id]) {
      const editorUid = editorUids[activeTab.id]
      const bounds = getSelectedTabBounds(newState, group.id)
      newState = ViewletLifecycle.createViewletForTab(newState, activeTab.id, viewletModuleIds[activeTab.id], bounds)
      newState = ViewletLifecycle.handleViewletReady(newState, editorUid, titles[activeTab.id])
    }
  }

  return newState
}
