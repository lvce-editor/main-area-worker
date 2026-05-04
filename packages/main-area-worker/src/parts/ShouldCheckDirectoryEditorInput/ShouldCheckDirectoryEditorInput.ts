import type { EditorInput } from '../EditorInput/EditorInput.ts'
import { isLocalEditorInput } from '../IsLocalEditorInput/IsLocalEditorInput.ts'

export const shouldCheckDirectoryEditorInput = (editorInput: EditorInput): editorInput is Extract<EditorInput, { type: 'editor' }> => {
  if (!isLocalEditorInput(editorInput)) {
    return false
  }
  const baseName = editorInput.uri.slice(editorInput.uri.lastIndexOf('/') + 1)
  return baseName.endsWith('/') || (baseName !== '' && !baseName.includes('.'))
}
