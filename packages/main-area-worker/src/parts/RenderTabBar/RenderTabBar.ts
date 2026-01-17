import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import { renderTab } from '../RenderTab/RenderTab.ts'

export const renderTabBar = (group: EditorGroup): readonly VirtualDomNode[] => {
  return [
    {
      childCount: group.tabs.length,
      className: 'MainTabs',
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab: Tab) => renderTab(tab, tab.id === group.activeTabId)),
  ]
}
