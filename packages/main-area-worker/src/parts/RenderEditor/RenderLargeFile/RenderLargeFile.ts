import { type VirtualDomNode, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as InputName from '../../InputName/InputName.ts'
import * as MainStrings from '../../MainStrings/MainStrings.ts'

const formatFileSize = (fileSize: number): string => {
  if (fileSize < 1024) {
    return `${fileSize} B`
  }
  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(2)} KB`
  }
  return `${(fileSize / 1024 / 1024).toFixed(2)} MB`
}

const button = (action: string, label: string, primary = false): readonly VirtualDomNode[] => [
  {
    childCount: 1,
    className: mergeClassNames(ClassNames.Button, primary ? ClassNames.ButtonPrimary : ClassNames.ButtonSecondary),
    'data-action': action,
    name: action,
    onClick: DomEventListenerFunctions.HandleClickAction,
    type: VirtualDomElements.Button,
  },
  text(label),
]

const textEditorLargeFileNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TextEditorLargeFile,
  type: VirtualDomElements.Div,
}

const editorContentLargeFileNode: VirtualDomNode = {
  childCount: 3,
  className: ClassNames.EditorContentLargeFile,
  type: VirtualDomElements.Div,
}

const warningIconNode: VirtualDomNode = {
  ariaHidden: true,
  childCount: 0,
  className: ClassNames.EditorLargeFileWarningIcon,
  type: VirtualDomElements.Div,
}

const paragraphNode: VirtualDomNode = {
  childCount: 1,
  type: VirtualDomElements.P,
}

const actionsNode: VirtualDomNode = {
  childCount: 4,
  className: ClassNames.EditorContentLargeFileActions,
  type: VirtualDomElements.Div,
}

export const renderLargeFile = (fileSize: number): readonly VirtualDomNode[] => {
  return [
    textEditorLargeFileNode,
    editorContentLargeFileNode,
    warningIconNode,
    paragraphNode,
    text(`${MainStrings.largeFileNotDisplayed()} (${formatFileSize(fileSize)}).`),
    actionsNode,
    ...button(InputName.OpenLargeFile, MainStrings.openAnyway(), true),
    ...button(InputName.ConfigureLargeFileLimit, MainStrings.configureLimit()),
  ]
}
