import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../EditorSplitDirection/EditorSplitDirection.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { applyDropAction } from './ApplyDropAction/ApplyDropAction.ts'
import { getDropAction } from './GetDropAction/GetDropAction.ts'

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, itemIds: readonly number[]): Promise<void> => {
  const splitDirection = context.getState().dragOverlay?.splitDirection ?? EditorSplitDirection.None
  await context.updateState(handleDragLeave)
  const { platform } = context.getState()
  const isElectron = platform === PlatformType.Electron
  const { uris } = await DragAndDropWorker.getDroppedItems(itemIds, isElectron)
  const actions = await getDropAction(uris)
  await applyDropAction(context, actions, splitDirection)
}
