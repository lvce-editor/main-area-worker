import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getSashClassName } from '../GetSashClassName/GetSashClassName.ts'

<<<<<<< HEAD
export const renderSash = (direction: 'horizontal' | 'vertical', sashId: string): readonly VirtualDomNode[] => {
=======
export const renderSash = (direction: LayoutDirection, sashId: string, style: string): readonly VirtualDomNode[] => {
>>>>>>> origin/main
  return [
    {
      childCount: 1,
      className: getSashClassName(direction),
      'data-sash-id': sashId,
      'data-sashId': sashId,
      onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
<<<<<<< HEAD
      type: VirtualDomElements.Div,
=======
      role: 'none',
      style,
      type: VirtualDomElements.Button,
>>>>>>> origin/main
    },
    {
      childCount: 0,
      className: 'SashBorder',
      type: VirtualDomElements.Div,
    },
  ]
}
