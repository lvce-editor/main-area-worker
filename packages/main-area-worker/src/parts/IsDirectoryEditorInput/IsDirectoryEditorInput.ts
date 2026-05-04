import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../EditorInput/EditorInput.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { shouldCheckDirectoryEditorInput } from '../ShouldCheckDirectoryEditorInput/ShouldCheckDirectoryEditorInput.ts'

export const isDirectoryEditorInput = async (editorInput: EditorInput): Promise<boolean> => {
  if (!shouldCheckDirectoryEditorInput(editorInput)) {
    return false
  }
  try {
    const type = await RendererWorker.invoke('FileSystem.stat', editorInput.uri)
    return type === DirentType.Directory
  } catch {
    return false
  }
}
