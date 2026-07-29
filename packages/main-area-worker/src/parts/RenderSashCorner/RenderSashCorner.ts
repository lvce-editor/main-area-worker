import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const sashCornerNode: VirtualDomNode = {
  childCount: 0,
  className: 'SashCorner',
  onPointerDown: DomEventListenerFunctions.HandleSashCornerPointerDown,
  role: AriaRoles.None,
  type: VirtualDomElements.Button,
}

export const renderSashCorner = (): VirtualDomNode => {
  return sashCornerNode
}
