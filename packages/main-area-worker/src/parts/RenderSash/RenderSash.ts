import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

<<<<<<< HEAD
export const renderSash = (direction: 'horizontal' | 'vertical', sashId: string, style: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: direction === 'horizontal' ? 'Sash SashVertical' : 'Sash SashHorizontal',
      'data-sashId': sashId,
      onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
      onPointerMove: DomEventListenerFunctions.HandleSashPointerMove,
      onPointerUp: DomEventListenerFunctions.HandleSashPointerUp,
      style,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'SashBorder',
      type: VirtualDomElements.Div,
    },
=======
const getSashClassName = (direction: 'horizontal' | 'vertical'): string => {
  return direction === 'horizontal' ? 'Sash SashVertical' : 'Sash SashHorizontal'
}

export const renderSash = (direction: 'horizontal' | 'vertical', sashId: string, style: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      className: getSashClassName(direction),
      'data-sashId': sashId,
      onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
      style,
      type: VirtualDomElements.Div,
    },
>>>>>>> origin/main
  ]
}
