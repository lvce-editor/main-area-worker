import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const renderSash = (direction: 'horizontal' | 'vertical'): VirtualDomNode => {
  return {
    childCount: 0,
    className: direction === 'vertical' ? 'SashVertical' : 'SashHorizontal',
    type: VirtualDomElements.Div,
  }
}
