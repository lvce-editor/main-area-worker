import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../EditorInput/EditorInput.ts'
import * as Preferences from '../Preferences/Preferences.ts'

const defaultMaxFileSizeMb = 50
const bytesPerMegabyte = 1024 * 1024

const getMaxFileSize = async (): Promise<number> => {
  try {
    const configuredLimit = await Preferences.get('files.maxFileSizeMB')
    if (typeof configuredLimit === 'number' && Number.isFinite(configuredLimit) && configuredLimit > 0) {
      return configuredLimit * bytesPerMegabyte
    }
  } catch {
    // Older renderer workers do not expose this preference yet.
  }
  return defaultMaxFileSizeMb * bytesPerMegabyte
}

export const getLargeFileSize = async (editorInput: EditorInput, forceOpen: boolean = false): Promise<number | undefined> => {
  if (editorInput.type !== 'editor' || forceOpen || !editorInput.uri.startsWith('file://')) {
    return undefined
  }
  try {
    const [fileSize, maxFileSize] = await Promise.all([RendererWorker.invoke('FileSystem.getFileSize', editorInput.uri), getMaxFileSize()])
    return typeof fileSize === 'number' && fileSize > maxFileSize ? fileSize : undefined
  } catch {
    // File systems without stat support should retain the existing open behavior.
    return undefined
  }
}
