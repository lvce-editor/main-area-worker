import type { DropAction } from '../DropAction/DropAction.ts'
import { isDirectoryEditorInput } from '../../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'

export const getDropAction = async (uris: readonly string[]): Promise<DropAction> => {
  for (const uri of uris) {
    if (uri.endsWith('/') || (await isDirectoryEditorInput({ type: 'editor', uri }))) {
      if (uri.startsWith('file://')) {
        return {
          command: 'setUri',
          value: uri,
        }
      }
      return {
        command: 'setPath',
        value: uri,
      }
    }
  }
  return {
    command: 'openFiles',
    uris,
  }
}
