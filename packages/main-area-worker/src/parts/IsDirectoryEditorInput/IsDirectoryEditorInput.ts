import type { EditorInput } from '../EditorInput/EditorInput.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { shouldCheckDirectoryEditorInput } from '../ShouldCheckDirectoryEditorInput/ShouldCheckDirectoryEditorInput.ts'

export const isDirectoryEditorInput = async (editorInput: EditorInput, applicationId?: string): Promise<boolean> => {
  if (!shouldCheckDirectoryEditorInput(editorInput)) {
    return false
  }
  try {
    const type = await ApplicationRpc.invoke(applicationId, 'FileSystem.stat', editorInput.uri)
    return type === DirentType.Directory
  } catch {
    return false
  }
}
