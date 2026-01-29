import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import { renderEditorGroupActions } from '../RenderEditorGroupActions/RenderEditorGroupActions.ts'
import { getTabsVirtualDom } from '../GetTabsVirtualDom/GetTabsVirtualDom.ts'

export const renderEditorGroupHeader = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean): readonly VirtualDomNode[] => {
  const tabsChildCount = group.tabs.length
  const actions = renderEditorGroupActions(group, groupIndex, splitButtonEnabled)

  return [
    {
      childCount: actions.length > 0 ? 2 : 1,
      className: 'EditorGroupHeader',
      role: 'none',
      type: VirtualDomElements.Div,
    },
    ...getTabsVirtualDom(group, groupIndex, tabsChildCount),
    ...actions,
  ]
}
