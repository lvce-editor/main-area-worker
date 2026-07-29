import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const dragOverlayVirtualDom: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.DragOverlay,
  type: VirtualDomElements.Div,
}

export const getDragOverlayVirtualDom = (): VirtualDomNode => {
  return dragOverlayVirtualDom
}
