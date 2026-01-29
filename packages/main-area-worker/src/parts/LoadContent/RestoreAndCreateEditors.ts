import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../Tab/Tab.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import * as Id from '../Id/Id.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const TAB_HEIGHT = 35

// Get viewlet module IDs for active tabs in each group
const getViewletModuleIds = async (layout: any): Promise<Record<string, string>> => {
  const viewletModuleIds: Record<string, string> = {}

  for (const group of layout.groups) {
    const activeTab = group.tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && activeTab.uri) {
      const viewletModuleId = await getViewletModuleId(activeTab.uri)
      if (viewletModuleId) {
        viewletModuleIds[activeTab.id] = viewletModuleId
      }
    }
  }

  return viewletModuleIds
}

// Create viewlets for the active tabs
const createViewlets = async (layout: any, viewletModuleIds: Record<string, string>, bounds: any): Promise<Record<string, number>> => {
  const editorUids: Record<string, number> = {}

  for (const group of layout.groups) {
    const activeTab = group.tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && viewletModuleIds[activeTab.id]) {
      const editorUid = activeTab.editorUid === -1 ? Id.create() : activeTab.editorUid
      editorUids[activeTab.id] = editorUid

      await createViewlet(viewletModuleIds[activeTab.id], editorUid, activeTab.id, bounds, activeTab.uri)
    }
  }

  return editorUids
}

// Update tabs with editor UIDs
const updateTabs = (state: MainAreaState, editorUids: Record<string, number>): MainAreaState => {
  const updatedGroups = state.layout.groups.map((group) => {
    return {
      ...group,
      tabs: group.tabs.map((tab) => {
        if (editorUids[tab.id]) {
          return {
            ...tab,
            editorUid: editorUids[tab.id],
          }
        }
        return tab
      }),
    }
  })

  return {
    ...state,
    layout: {
      ...state.layout,
      groups: updatedGroups,
    },
  }
}

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
