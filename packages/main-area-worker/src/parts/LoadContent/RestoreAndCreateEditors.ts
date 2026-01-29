import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../Tab/Tab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'
import { createViewlets } from '../CreateViewlets/CreateViewlets.ts'
import { getViewletModuleIds } from '../GetViewletModuleIds/GetViewletModuleIds.ts'
import { updateTabs } from '../UpdateTabs/UpdateTabs.ts'

const TAB_HEIGHT = 35

export const restoreAndCreateEditors = async (state: MainAreaState, restoredLayout: any): Promise<MainAreaState> => {
  let newState: MainAreaState = {
    ...state,
    layout: restoredLayout,
  }

  const bounds = {
    height: newState.height - TAB_HEIGHT,
    width: newState.width,
    x: newState.x,
    y: newState.y + TAB_HEIGHT,
  }

  // Get viewlet module IDs for all active tabs
  const viewletModuleIds = await getViewletModuleIds(newState.layout)

  // Create viewlets and get editor UIDs
  const editorUids = await createViewlets(newState.layout, viewletModuleIds, bounds)

  // Update tabs with editor UIDs
  newState = updateTabs(newState, editorUids)

  // Create viewlets in the lifecycle and mark them as ready
  for (const group of newState.layout.groups) {
    const activeTab = group.tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && viewletModuleIds[activeTab.id]) {
      const editorUid = editorUids[activeTab.id]
      newState = ViewletLifecycle.createViewletForTab(newState, activeTab.id, viewletModuleIds[activeTab.id], bounds)
      newState = ViewletLifecycle.handleViewletReady(newState, editorUid)
    }
  }

  return newState
}
