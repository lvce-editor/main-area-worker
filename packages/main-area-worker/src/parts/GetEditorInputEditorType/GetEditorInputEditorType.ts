import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { EditorType } from '../EditorType/EditorType.ts'

export const getEditorInputEditorType = (editorInput: EditorInput): EditorType => {
  switch (editorInput.type) {
    case 'diff-editor':
    case 'extension-detail-view':
    case 'image':
    case 'process-explorer':
    case 'running-extensions':
    case 'video':
    case 'webview':
      return 'custom'
    case 'editor':
      return 'text'
  }
}
