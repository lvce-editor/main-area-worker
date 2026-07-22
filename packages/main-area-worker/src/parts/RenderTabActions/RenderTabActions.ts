import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const dirtyIconNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.MaskIconCircleFilled,
  type: VirtualDomElements.Div,
}

const closeIconNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.MaskIconClose,
  type: VirtualDomElements.Div,
}

export const renderTabActions = (isDirty: boolean, tabIndex: number, groupIndex: number): readonly VirtualDomNode[] => {
  if (isDirty) {
    return [
      {
        'aria-label': 'Close',
        childCount: 1,
        className: ClassNames.EditorTabCloseButton,
        'data-groupIndex': groupIndex,
        'data-index': tabIndex,
        onClick: DomEventListenerFunctions.HandleClickClose,
        type: VirtualDomElements.Button,
      },
      dirtyIconNode,
    ]
  }

  return [
    {
      'aria-label': 'Close',
      childCount: 1,
      className: ClassNames.EditorTabCloseButton,
      'data-groupIndex': groupIndex,
      'data-index': tabIndex,
      onClick: DomEventListenerFunctions.HandleClickClose,
      type: VirtualDomElements.Button,
    },
    closeIconNode,
  ]
}
