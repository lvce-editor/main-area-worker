import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../EditorSplitDirection/EditorSplitDirection.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { resetPointerDown } from '../ResetPointerDown/ResetPointerDown.ts'
import { applyDropAction } from './ApplyDropAction/ApplyDropAction.ts'
import { applyTabDrop } from './ApplyTabDrop/ApplyTabDrop.ts'
import { getDropAction } from './GetDropAction/GetDropAction.ts'

const normalizeUri = (uri: string): string => {
  return uri.startsWith('/') ? `file://${uri}` : uri
}

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, dropIdOrItemIds: number | readonly number[]): Promise<void> => {
  const initialState = context.getState()
  const { pointerDownGroupIndex, pointerDownTabIndex } = initialState
  const sourceGroup = initialState.layout.groups[pointerDownGroupIndex]
  const draggedTab = sourceGroup?.tabs[pointerDownTabIndex]
  const { splitDirection = EditorSplitDirection.None, targetGroupId } = initialState.dragOverlay ?? {}
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
  if (draggedTab?.uri && uris.length === 1 && normalizeUri(uris[0]) === normalizeUri(draggedTab.uri)) {
    await context.updateState((state) => resetPointerDown(applyTabDrop(state, sourceGroup.id, draggedTab.id, splitDirection, targetGroupId)))
    return
  }
  const actions = await getDropAction(uris)
  await applyDropAction(context, actions, splitDirection, targetGroupId)
}
