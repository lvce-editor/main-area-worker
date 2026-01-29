import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import { renderTab } from '../RenderTab/RenderTab.ts'
import { renderEditorGroupActions } from '../RenderEditorGroupActions/RenderEditorGroupActions.ts'

export const renderEditorGroupHeader = (group: EditorGroup, groupIndex: number): readonly VirtualDomNode[] => {
  const tabsChildCount = group.tabs.length
  const actionsChildCount = 1 // EditorGroupActions container

  return [
    {
      childCount: 2,
      className: 'EditorGroupHeader',
      type: VirtualDomElements.Div,
    },
    {
      childCount: tabsChildCount,
      className: 'MainTabs',
      role: 'tablist',
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab: Tab, tabIndex: number) => renderTab(tab, tab.id === group.activeTabId, tabIndex, groupIndex)),
    ...renderEditorGroupActions(group, groupIndex),
  ]
}
