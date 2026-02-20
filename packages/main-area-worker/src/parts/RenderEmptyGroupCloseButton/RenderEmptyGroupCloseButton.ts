import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MainStrings from '../MainStrings/MainStrings.ts'

export const renderEmptyGroupCloseButton = (group: EditorGroup, groupIndex: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.EmptyGroupCloseButton,
      'data-groupId': String(group.id),
      name: 'close-group',
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: MainStrings.closeEditorGroup(),
      type: VirtualDomElements.Button,
    },
    text('✕'),
  ]
}
