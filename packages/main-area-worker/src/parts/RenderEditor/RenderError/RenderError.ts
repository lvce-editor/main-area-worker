import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'

export const renderError = (errorMessage: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.TextEditorError,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.EditorContentError,
      type: VirtualDomElements.Div,
    },
    text(`Error: ${errorMessage}`),
    {
      childCount: 1,
      className: `${ClassNames.Button} ${ClassNames.ButtonSecondary}`,
      'data-action': InputName.RetryOpen,
      name: InputName.RetryOpen,
      onClick: DomEventListenerFunctions.HandleClickAction,
      type: VirtualDomElements.Button,
    },
    text('Retry'),
  ]
}
