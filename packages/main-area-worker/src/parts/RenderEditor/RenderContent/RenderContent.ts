import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

const textEditorNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TextEditor,
  type: VirtualDomElements.Div,
}

const editorContentNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorContent,
  type: VirtualDomElements.Pre,
}

export const renderContent = (content: string): readonly VirtualDomNode[] => {
  return [textEditorNode, editorContentNode, text(content)]
}
