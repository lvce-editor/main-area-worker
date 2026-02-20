import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

export const renderLoading = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.TextEditorLoading,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.EditorContentLoading,
      type: VirtualDomElements.Div,
    },
    text('Loading...'),
  ]
}
