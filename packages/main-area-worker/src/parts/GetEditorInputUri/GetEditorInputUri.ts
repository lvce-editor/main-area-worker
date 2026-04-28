import type { EditorInput } from '../EditorInput/EditorInput.ts'

export const getEditorInputUri = (editorInput: EditorInput): string => {
  switch (editorInput.type) {
    case 'diff-editor':
      return `diff://?left=${encodeURIComponent(editorInput.uriLeft)}&right=${encodeURIComponent(editorInput.uriRight)}`
    case 'editor':
      return editorInput.uri
    case 'extension-detail-view':
      return `extension-detail://${editorInput.extensionId}`
  }
}