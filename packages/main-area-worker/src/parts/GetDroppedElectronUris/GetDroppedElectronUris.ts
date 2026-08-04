import { RendererWorker } from '@lvce-editor/rpc-registry'
import { toFileUri } from '../ToFileUri/ToFileUri.ts'

export const getDroppedElectronUris = async (itemIds: readonly number[], files: FileList | readonly File[]): Promise<readonly string[]> => {
  if (itemIds.length > 0) {
    await RendererWorker.getFileHandles(itemIds)
  }
  const uris: string[] = []
  for (const file of files) {
    const path = await RendererWorker.invoke('FileSystemHandle.getFilePathElectron', file)
    uris.push(toFileUri(path))
  }
  return uris
}
