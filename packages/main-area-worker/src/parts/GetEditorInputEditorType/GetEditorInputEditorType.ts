import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { EditorType } from '../EditorType/EditorType.ts'

export const getEditorInputEditorType = (editorInput: EditorInput): EditorType => {
  switch (editorInput.type) {
    case 'diff-editor':
    case 'extension-detail-view':
      return 'custom'
    case 'editor':
      return 'text'
  }
}
