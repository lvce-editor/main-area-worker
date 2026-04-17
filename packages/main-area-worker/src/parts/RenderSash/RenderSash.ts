import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getSashClassName } from '../GetSashClassName/GetSashClassName.ts'

export const renderSash = (direction: LayoutDirection, sashId: string, style: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: getSashClassName(direction),
      'data-sashId': sashId,
      onPointerDown: DomEventListenerFunctions.HandleSashPointerDown,
      role: 'none',
      style,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'SashBorder',
      type: VirtualDomElements.Div,
    },
  ]
}
