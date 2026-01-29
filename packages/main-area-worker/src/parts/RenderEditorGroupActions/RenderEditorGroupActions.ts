import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MainStrings from '../MainStrings/MainStrings.ts'

export const renderEditorGroupActions = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean): readonly VirtualDomNode[] => {
  if (!splitButtonEnabled) {
    return []
  }

  return [
    {
      childCount: 1,
      className: 'EditorGroupActions',
      role: 'toolbar',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorGroupActionButton SplitEditorGroupButton',
      'data-action': 'split-right',
      'data-groupId': String(group.id),
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: MainStrings.splitEditorGroup(),
      type: VirtualDomElements.Button,
    },
    text('split'),
  ]
}
