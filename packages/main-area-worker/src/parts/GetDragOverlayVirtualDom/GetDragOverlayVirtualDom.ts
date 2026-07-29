import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { DragOverlay } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getDragOverlayVirtualDom = (dragOverlay: DragOverlay): VirtualDomNode => {
  const { height, width, x, y } = dragOverlay
  return {
    childCount: 0,
    className: ClassNames.DragOverlay,
    style: `left:${x}px;top:${y}px;width:${width}px;height:${height}px;`,
    type: VirtualDomElements.Div,
  }
}
