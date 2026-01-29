import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import { renderEditorGroupActions } from '../RenderEditorGroupActions/RenderEditorGroupActions.ts'
import { renderTab } from '../RenderTab/RenderTab.ts'

export const renderEditorGroupHeader = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean): readonly VirtualDomNode[] => {
  const tabsChildCount = group.tabs.length
  const actions = renderEditorGroupActions(group, groupIndex, splitButtonEnabled)

  return [
    {
      childCount: 2,
      className: 'EditorGroupHeader',
      role: 'none',
      type: VirtualDomElements.Div,
    },
    {
      childCount: tabsChildCount,
      className: 'MainTabs',
      role: 'tablist',
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab: Tab, tabIndex: number) => renderTab(tab, tab.id === group.activeTabId, tabIndex, groupIndex)),
    ...actions,
  ]
}
