import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderSash = (direction: 'horizontal' | 'vertical', sashId: string, style: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      className: direction === 'horizontal' ? 'Sash SashVertical' : 'Sash SashHorizontal',
      'data-sashId': sashId,
      onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
      style,
      type: VirtualDomElements.Div,
    },
  ]
}
