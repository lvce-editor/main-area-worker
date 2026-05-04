import type { EditorInput } from '../EditorInput/EditorInput.ts'

export const isLocalEditorInput = (editorInput: EditorInput): editorInput is Extract<EditorInput, { type: 'editor' }> => {
  if (editorInput.type !== 'editor') {
    return false
  }
  return editorInput.uri.startsWith('file://') || !editorInput.uri.includes('://')
}
