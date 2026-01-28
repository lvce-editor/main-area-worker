import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { getMaxIdFromLayout } from '../GetMaxIdFromLayout/GetMaxIdFromLayout.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import * as Id from '../Id/Id.ts'
import { tryRestoreLayout } from '../TryRestoreLayout/TryRestoreLayout.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const loadContent = async (state: MainAreaState, savedState: unknown): Promise<MainAreaState> => {
  const restoredLayout = tryRestoreLayout(savedState)
  if (restoredLayout) {
    const maxId = getMaxIdFromLayout(restoredLayout)
    Id.setMinId(maxId)
    let newState: MainAreaState = {
      ...state,
      layout: restoredLayout,
    }

    // Create viewlets only for active tabs in each group
    const TAB_HEIGHT = 35
    const bounds = {
      height: newState.height - TAB_HEIGHT,
      width: newState.width,
      x: newState.x,
      y: newState.y + TAB_HEIGHT,
    }

    for (const group of restoredLayout.groups) {
      // Find the active tab in this group
      const activeTab = group.tabs.find((tab) => tab.id === group.activeTabId)
      if (activeTab && activeTab.uri) {
        const viewletModuleId = await getViewletModuleId(activeTab.uri)
        if (viewletModuleId) {
          // Ensure the tab has an editorUid
          const editorUid = activeTab.editorUid === -1 ? Id.create() : activeTab.editorUid

          // Create viewlet for the tab
          newState = ViewletLifecycle.createViewletForTab(newState, activeTab.id, viewletModuleId, bounds)

          // Update the tab with the editorUid in the state
          const updatedGroups = newState.layout.groups.map((g) => {
            if (g.id !== group.id) {
              return g
            }
            return {
              ...g,
              tabs: g.tabs.map((t) => {
                if (t.id !== activeTab.id) {
                  return t
                }
                return {
                  ...t,
                  editorUid,
                }
              }),
            }
          })

          newState = {
            ...newState,
            layout: {
              ...newState.layout,
              groups: updatedGroups,
            },
          }

          // Create the actual viewlet instance
          await createViewlet(viewletModuleId, editorUid, activeTab.id, bounds, activeTab.uri)

          // Mark the viewlet as ready
          newState = ViewletLifecycle.handleViewletReady(newState, editorUid)
        }
      }
    }

    return newState
  }
  return {
    ...state,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
}
