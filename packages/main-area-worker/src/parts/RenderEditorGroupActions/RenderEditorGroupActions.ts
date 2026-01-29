import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEditorGroupActions = (group: EditorGroup, groupIndex: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'EditorGroupActions',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorGroupActionButton SplitEditorGroupButton',
      'data-action': 'split-right',
      'data-groupId': String(group.id),
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: 'Split Editor Group',
      type: VirtualDomElements.Button,
    },
    text('split'),
  ]
}
