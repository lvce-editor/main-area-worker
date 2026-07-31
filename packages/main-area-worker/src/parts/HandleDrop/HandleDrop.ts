import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { type DroppedItem, getDroppedItems } from '../GetDroppedUris/GetDroppedUris.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { openUrisWithContext } from '../OpenUris/OpenUris.ts'

const isDirectory = async (item: DroppedItem): Promise<boolean> => {
  if (item.kind !== 'unknown') {
    return item.kind === 'directory'
  }
  try {
    return (await RendererWorker.invoke('FileSystem.stat', item.uri)) === DirentType.Directory
  } catch {
    return false
  }
}

const setWorkspaceFolder = (uri: string): void => {
  if (uri.startsWith('file://')) {
    void Promise.resolve(RendererWorker.invoke('Workspace.setUri', uri)).catch(() => {})
    return
  }
  void Promise.resolve(RendererWorker.setWorkspacePath(uri)).catch(() => {})
}

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, itemIds: readonly number[]): Promise<void> => {
  await context.updateState(handleDragLeave)
  const items = await getDroppedItems(itemIds)
  for (const item of items) {
    if (await isDirectory(item)) {
      setWorkspaceFolder(item.uri)
      return
    }
  }
  const uris = items.map((item) => item.uri)
  await openUrisWithContext(context, uris)
}
