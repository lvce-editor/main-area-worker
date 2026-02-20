import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderSash = (direction: 'horizontal' | 'vertical', sashId: string): VirtualDomNode => {
  return {
    childCount: 0,
    className: direction === 'vertical' ? 'SashVertical' : 'SashHorizontal',
    'data-sashId': sashId,
    onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
    onPointerMove: DomEventListenerFunctions.HandleSashPointerMove,
    onPointerUp: DomEventListenerFunctions.HandleSashPointerUp,
    type: VirtualDomElements.Div,
  }
}
