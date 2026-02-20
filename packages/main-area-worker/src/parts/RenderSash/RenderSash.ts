import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const renderSash = (direction: 'horizontal' | 'vertical', groupIndex: number): VirtualDomNode => {
  return {
    childCount: 0,
    className: direction === 'vertical' ? 'SashVertical' : 'SashHorizontal',
    // 'data-group-index': groupIndex,
    type: VirtualDomElements.Div,
    // Optionally, add event listeners for resizing here
  }
}
