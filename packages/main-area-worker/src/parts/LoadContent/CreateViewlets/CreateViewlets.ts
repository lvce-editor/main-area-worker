import type { Tab } from '../../Tab/Tab.ts'
import { createViewlet } from '../../CreateViewlet/CreateViewlet.ts'
import * as Id from '../../Id/Id.ts'

export const createViewlets = async (layout: any, viewletModuleIds: Record<string, string>, bounds: any): Promise<Record<string, number>> => {
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
