import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderTab } from '../RenderTab/RenderTab.ts'

export const getTabsVirtualDom = (group: EditorGroup, groupIndex: number, tabsChildCount: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: tabsChildCount,
      className: ClassNames.MainTabs,
      role: 'tablist',
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab: Tab, tabIndex: number) => renderTab(tab, tab.id === group.activeTabId, tabIndex, groupIndex)),
  ]
}
