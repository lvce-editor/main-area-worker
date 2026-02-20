import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'

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
      'data-action': 'retry-open',
      onClick: DomEventListenerFunctions.HandleClickAction,
      type: VirtualDomElements.Button,
    },
    text('Retry'),
  ]
}
