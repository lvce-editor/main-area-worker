import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEmptyGroupCloseButton } from '../RenderEmptyGroupCloseButton/RenderEmptyGroupCloseButton.ts'
import { renderWaterMark } from '../RenderWaterMark/RenderWaterMark.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

export const renderEmptyEditorGroup = (
  group: EditorGroup,
  groupIndex: number,
  style: string,
  closeButtonEnabled: boolean = true,
): readonly VirtualDomNode[] => {
  const closeButtonDom = closeButtonEnabled ? renderEmptyGroupCloseButton(group, groupIndex) : []
  return [
    {
      childCount: closeButtonEnabled ? 2 : 1,
      className: ClassNames.EditorGroup,
      'data-groupId': String(group.id),
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      style,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    ...closeButtonDom,
    ...renderWaterMark(group.id),
  ]
}
