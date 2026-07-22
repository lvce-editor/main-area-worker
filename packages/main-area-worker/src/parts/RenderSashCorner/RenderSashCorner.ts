import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderSashCorner = (): VirtualDomNode => {
  return {
    childCount: 0,
    className: 'SashCorner',
    onPointerDown: DomEventListenerFunctions.HandleSashCornerPointerDown,
    role: AriaRoles.None,
    type: VirtualDomElements.Button,
  }
}
