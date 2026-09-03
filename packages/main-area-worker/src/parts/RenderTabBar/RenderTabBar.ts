import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, TabDropIndicator } from '../MainAreaState/MainAreaState.ts'
import { getTabsVirtualDom } from '../GetTabsVirtualDom/GetTabsVirtualDom.ts'

export const renderTabBar = (group: EditorGroup, groupIndex: number, tabDropIndicator?: TabDropIndicator): readonly VirtualDomNode[] => {
  return getTabsVirtualDom(group, groupIndex, group.tabs.length, tabDropIndicator)
}
