import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEmptyGroupCloseButton } from '../RenderEmptyGroupCloseButton/RenderEmptyGroupCloseButton.ts'
import { renderWaterMark } from '../RenderWaterMark/RenderWaterMark.ts'

export const renderEmptyEditorGroup = (group: EditorGroup, groupIndex: number, style: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.EditorGroup,
      'data-groupId': String(group.id),
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      style,
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    ...renderEmptyGroupCloseButton(group, groupIndex),
    ...renderWaterMark(group.id),
  ]
}
