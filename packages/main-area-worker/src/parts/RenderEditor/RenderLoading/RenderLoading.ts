import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

const textEditorLoadingNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TextEditorLoading,
  type: VirtualDomElements.Div,
}

const editorContentLoadingNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorContentLoading,
  type: VirtualDomElements.Div,
}

export const renderLoading = (): readonly VirtualDomNode[] => {
  return [textEditorLoadingNode, editorContentLoadingNode, text('Loading...')]
}
