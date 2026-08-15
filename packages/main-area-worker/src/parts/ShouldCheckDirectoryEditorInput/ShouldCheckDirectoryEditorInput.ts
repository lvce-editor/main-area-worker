import type { EditorInput } from '../EditorInput/EditorInput.ts'

export const shouldCheckDirectoryEditorInput = (editorInput: EditorInput): editorInput is Extract<EditorInput, { type: 'editor' }> => {
  if (editorInput.type !== 'editor') {
    return false
  }
  const baseName = editorInput.uri.slice(editorInput.uri.lastIndexOf('/') + 1)
  return baseName.endsWith('/') || (baseName !== '' && !baseName.includes('.'))
}
