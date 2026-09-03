import { AriaRoles, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab, TabDropIndicator } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTab } from '../RenderTab/RenderTab.ts'

const getDropIndicatorPosition = (
  group: EditorGroup,
  tabIndex: number,
  tabDropIndicator: TabDropIndicator | undefined,
): 'after' | 'before' | undefined => {
  if (tabDropIndicator?.groupId !== group.id) {
    return undefined
  }
  if (tabDropIndicator.index === tabIndex) {
    return 'before'
  }
  if (tabDropIndicator.index === group.tabs.length && tabIndex === group.tabs.length - 1) {
    return 'after'
  }
  return undefined
}

export const getTabsVirtualDom = (
  group: EditorGroup,
  groupIndex: number,
  tabsChildCount: number,
  tabDropIndicator?: TabDropIndicator,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: tabsChildCount,
      className: ClassNames.MainTabs,
      'data-groupIndex': groupIndex,
      onDragOver: DomEventListenerFunctions.HandleTabsDragOver,
      onWheel: DomEventListenerFunctions.HandleTabsWheel,
      role: AriaRoles.TabList,
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab: Tab, tabIndex: number) =>
      renderTab(tab, tab.id === group.activeTabId, tabIndex, groupIndex, getDropIndicatorPosition(group, tabIndex, tabDropIndicator)),
    ),
  ]
}
