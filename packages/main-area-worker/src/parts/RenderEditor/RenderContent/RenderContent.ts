import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

export const renderContent = (content: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.TextEditor,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.EditorContent,
      type: VirtualDomElements.Pre,
    },
    text(content),
  ]
}
