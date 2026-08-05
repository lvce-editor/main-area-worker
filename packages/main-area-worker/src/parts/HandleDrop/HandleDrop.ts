import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { openUrisWithContext } from '../OpenUris/OpenUris.ts'

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, itemIds: readonly number[]): Promise<void> => {
  await context.updateState(handleDragLeave)
  const { platform } = context.getState()
  const isElectron = platform === PlatformType.Electron
  const { uris } = await DragAndDropWorker.getDroppedItems(itemIds, isElectron)
  for (const uri of uris) {
    if (uri.endsWith('/') || (await isDirectoryEditorInput({ type: 'editor', uri }))) {
      const command = uri.startsWith('file://') ? 'Workspace.setUri' : 'Workspace.setPath'
      await RendererWorker.invoke(command, uri)
      return
    }
  }
  await openUrisWithContext(context, uris)
}
