import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const renderError = (errorMessage: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'TextEditor TextEditor--error',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--error',
      type: VirtualDomElements.Div,
    },
    text(`Error: ${errorMessage}`),
  ]
}
