import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'
import * as MainStrings from '../../MainStrings/MainStrings.ts'

const textEditorBinaryNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TextEditorBinary,
  type: VirtualDomElements.Div,
}

const editorContentBinaryNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.EditorContentBinary,
  type: VirtualDomElements.Div,
}

const paragraphNode: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.P,
}

const openInTextEditorButtonNode: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
  'data-action': InputName.OpenInTextEditor,
  name: InputName.OpenInTextEditor,
  onClick: DomEventListenerFunctions.HandleClickAction,
  type: VirtualDomElements.Button,
}

export const renderBinary = (): readonly VirtualDomNode[] => {
  return [
    textEditorBinaryNode,
    editorContentBinaryNode,
    paragraphNode,
    text(MainStrings.binaryFileNotDisplayed()),
    openInTextEditorButtonNode,
    text(MainStrings.openInTextEditor()),
  ]
}
