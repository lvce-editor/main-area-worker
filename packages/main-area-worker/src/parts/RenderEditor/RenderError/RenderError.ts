import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'
import * as MainStrings from '../../MainStrings/MainStrings.ts'

const textEditorErrorNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TextEditorError,
  type: VirtualDomElements.Div,
}

const editorContentErrorNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.EditorContentError,
  type: VirtualDomElements.Div,
}

const paragraphNode: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.P,
}

export const renderError = (errorMessage: string): readonly VirtualDomNode[] => {
  return [
    textEditorErrorNode,
    editorContentErrorNode,
    paragraphNode,
    text(`Error: ${errorMessage}`),
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
      'data-action': InputName.RetryOpen,
      name: InputName.RetryOpen,
      onClick: DomEventListenerFunctions.HandleClickAction,
      type: VirtualDomElements.Button,
    },
    text(MainStrings.retry()),
  ]
}
