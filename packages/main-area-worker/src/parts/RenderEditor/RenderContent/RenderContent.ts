import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const renderContent = (content: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'TextEditor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent',
      type: VirtualDomElements.Pre,
    },
    text(content),
  ]
}
