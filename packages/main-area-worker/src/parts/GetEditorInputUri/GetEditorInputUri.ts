import type { EditorInput } from '../EditorInput/EditorInput.ts'

export const getEditorInputUri = (editorInput: EditorInput): string => {
  switch (editorInput.type) {
    case 'diff-editor':
      return `diff://?left=${encodeURIComponent(editorInput.uriLeft)}&right=${encodeURIComponent(editorInput.uriRight)}`
    case 'editor':
    case 'image':
    case 'video':
    case 'webview':
      return editorInput.uri
    case 'extension-detail-view':
      return `extension-detail://${editorInput.extensionId}`
    case 'process-explorer':
      return 'process-explorer://'
    case 'running-extensions':
      return 'running-extensions://'
  }
}
