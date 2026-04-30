import type { EditorInput } from '../EditorInput/EditorInput.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const getEditorInputTitle = (editorInput: EditorInput): string => {
  switch (editorInput.type) {
    case 'diff-editor': {
      const leftTitle = PathDisplay.getLabel(editorInput.uriLeft)
      const rightTitle = PathDisplay.getLabel(editorInput.uriRight)
      return `${leftTitle} - ${rightTitle}`
    }
    case 'editor':
      return PathDisplay.getLabel(editorInput.uri)
    case 'extension-detail-view':
      return editorInput.extensionId
  }
}
