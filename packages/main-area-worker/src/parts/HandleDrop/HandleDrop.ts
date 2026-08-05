import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as EditorSplitDirection from '../EditorSplitDirection/EditorSplitDirection.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { openUrisWithContext } from '../OpenUris/OpenUris.ts'
import { splitDown } from '../SplitDown/SplitDown.ts'
import { splitLeft } from '../SplitLeft/SplitLeft.ts'
import { splitRight } from '../SplitRight/SplitRight.ts'
import { splitUp } from '../SplitUp/SplitUp.ts'

const splitForDrop = (state: MainAreaState, splitDirection: number): MainAreaState => {
  switch (splitDirection) {
    case EditorSplitDirection.Down:
      return splitDown(state)
    case EditorSplitDirection.Left:
      return splitLeft(state)
    case EditorSplitDirection.Right:
      return splitRight(state)
    case EditorSplitDirection.Up:
      return splitUp(state)
    default:
      return state
  }
}

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, itemIds: readonly number[]): Promise<void> => {
  const splitDirection = context.getState().dragOverlay?.splitDirection ?? EditorSplitDirection.None
  await context.updateState(handleDragLeave)
  const { platform } = context.getState()
  const isElectron = platform === PlatformType.Electron
  const { uris } = await DragAndDropWorker.getDroppedItems(itemIds, isElectron)
  for (const uri of uris) {
    if (uri.endsWith('/') || (await isDirectoryEditorInput({ type: 'editor', uri }))) {
      const command = uri.startsWith('file://') ? 'Workspace.setUri' : 'Workspace.setPath'
      void RendererWorker.invoke(command, uri).catch(() => {})
      return
    }
  }
  if (uris.length > 0 && splitDirection !== EditorSplitDirection.None) {
    await context.updateState((state) => splitForDrop(state, splitDirection))
  }
  await openUrisWithContext(context, uris, splitDirection === EditorSplitDirection.None)
}
