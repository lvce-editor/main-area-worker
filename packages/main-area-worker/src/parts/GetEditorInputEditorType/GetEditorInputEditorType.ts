import type { EditorType } from '../EditorType/EditorType.ts'
import type { EditorInput } from '../EditorInput/EditorInput.ts'

export const getEditorInputEditorType = (editorInput: EditorInput): EditorType => {
  switch (editorInput.type) {
    case 'editor':
      return 'text'
    case 'diff-editor':
    case 'extension-detail-view':
      return 'custom'
  }
}