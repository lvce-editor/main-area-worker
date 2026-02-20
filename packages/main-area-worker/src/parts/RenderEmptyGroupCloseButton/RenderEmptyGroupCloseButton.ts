import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEmptyGroupCloseButton = (group: EditorGroup, groupIndex: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.EmptyGroupCloseButton,
      'data-action': 'close-group',
      'data-groupId': String(group.id),
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: 'Close editor group',
      type: VirtualDomElements.Button,
    },
    text('✕'),
  ]
}
