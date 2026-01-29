import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const renderLoading = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'TextEditor TextEditor--loading',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--loading',
      type: VirtualDomElements.Div,
    },
    text('Loading...'),
  ]
}
