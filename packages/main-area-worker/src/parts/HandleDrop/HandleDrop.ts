import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getDroppedUris } from '../GetDroppedUris/GetDroppedUris.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { openUrisWithContext } from '../OpenUris/OpenUris.ts'

export const handleDrop = async (
  context: AsyncCommandContext<MainAreaState>,
  itemIds: readonly number[],
  files: FileList | readonly File[] = [],
): Promise<void> => {
  await context.updateState(handleDragLeave)
  const { platform } = context.getState()
  const uris = await getDroppedUris(itemIds, files, platform)
  for (const uri of uris) {
    if (uri.endsWith('/') || (await isDirectoryEditorInput({ type: 'editor', uri }))) {
      const command = uri.startsWith('file://') ? 'Workspace.setUri' : 'Workspace.setPath'
      void RendererWorker.invoke(command, uri).catch(() => {})
      return
    }
  }
  await openUrisWithContext(context, uris)
}
