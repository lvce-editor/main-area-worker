import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../EditorSplitDirection/EditorSplitDirection.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { applyDropAction } from './ApplyDropAction/ApplyDropAction.ts'
import { getDropAction } from './GetDropAction/GetDropAction.ts'

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, dropIdOrItemIds: number | readonly number[]): Promise<void> => {
  const { splitDirection = EditorSplitDirection.None, targetGroupId } = context.getState().dragOverlay ?? {}
  await context.updateState(handleDragLeave)
  const { platform } = context.getState()
  const isElectron = platform === PlatformType.Electron
  let uris: readonly string[]
  if (typeof dropIdOrItemIds === 'number') {
    uris = await DragAndDropWorker.getDroppedUrisByDropId(dropIdOrItemIds, isElectron)
  } else {
    const { uris: droppedUris } = await DragAndDropWorker.getDroppedItems(dropIdOrItemIds, isElectron)
    uris = droppedUris
  }
  const actions = await getDropAction(uris)
  await applyDropAction(context, actions, splitDirection, targetGroupId)
}
