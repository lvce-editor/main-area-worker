import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getDroppedUris } from '../GetDroppedUris/GetDroppedUris.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { openUrisWithContext } from '../OpenUris/OpenUris.ts'

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, itemIds: readonly number[]): Promise<void> => {
  await context.updateState(handleDragLeave)
  const uris = await getDroppedUris(itemIds)
  await openUrisWithContext(context, uris)
}
