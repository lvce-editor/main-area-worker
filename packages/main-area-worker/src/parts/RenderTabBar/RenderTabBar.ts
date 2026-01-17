import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import { renderTab } from '../RenderTab/RenderTab.ts'

export const renderTabBar = (group: EditorGroup, groupIndex: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: group.tabs.length,
      className: 'MainTabs',
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab: Tab, tabIndex: number) => renderTab(tab, tab.id === group.activeTabId, tabIndex, groupIndex)),
  ]
}
