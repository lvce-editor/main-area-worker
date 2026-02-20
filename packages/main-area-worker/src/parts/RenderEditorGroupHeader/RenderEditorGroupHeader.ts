import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getTabsVirtualDom } from '../GetTabsVirtualDom/GetTabsVirtualDom.ts'
import { renderEditorGroupActions } from '../RenderEditorGroupActions/RenderEditorGroupActions.ts'

export const renderEditorGroupHeader = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean): readonly VirtualDomNode[] => {
  const tabsChildCount = group.tabs.length
  const actions = renderEditorGroupActions(group, groupIndex, splitButtonEnabled)

  const hasActions = actions.length > 0
  return [
    {
      childCount: hasActions ? 2 : 1,
      className: 'EditorGroupHeader',
      onDblClick: DomEventListenersFunctions.HandleHeaderDoubleClick,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...getTabsVirtualDom(group, groupIndex, tabsChildCount),
    ...actions,
  ]
}
