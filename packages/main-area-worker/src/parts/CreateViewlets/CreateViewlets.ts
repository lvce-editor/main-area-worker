import type { Tab } from '../Tab/Tab.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import * as Id from '../Id/Id.ts'

interface CreatedViewlets {
  readonly editorUids: Record<string, number>
  readonly titles: Record<string, string>
}

export const createViewlets = async (layout: any, viewletModuleIds: Record<string, string>, bounds: any): Promise<CreatedViewlets> => {
  const editorUids: Record<string, number> = {}
  const titles: Record<string, string> = {}

  for (const group of layout.groups) {
    const activeTab = group.tabs.find((tab: Tab) => tab.id === group.activeTabId)
    if (activeTab && viewletModuleIds[activeTab.id]) {
      const editorUid = activeTab.editorUid === -1 ? Id.create() : activeTab.editorUid
      editorUids[activeTab.id] = editorUid

      const title = await createViewlet(viewletModuleIds[activeTab.id], editorUid, activeTab.id, bounds, activeTab.uri)
      if (title) {
        titles[activeTab.id] = title
      }
    }
  }

  return { editorUids, titles }
}
