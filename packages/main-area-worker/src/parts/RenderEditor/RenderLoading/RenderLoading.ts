import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

const textEditorLoadingNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TextEditorLoading,
  type: VirtualDomElements.Div,
}

const editorContentLoadingNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.EditorContentLoading,
  type: VirtualDomElements.Div,
}

const loadingIconNode: VirtualDomNode = {
  ariaHidden: true,
  childCount: 0,
  className: ClassNames.EditorLoadingIcon,
  type: VirtualDomElements.Div,
}

export const renderLoading = (): readonly VirtualDomNode[] => {
  return [textEditorLoadingNode, editorContentLoadingNode, loadingIconNode, text('Loading...')]
}
