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

interface DropActionOpenFiles {
  readonly command: 'openFiles'
  readonly uris: readonly string[]
}
interface DropActionSetPath {
  readonly command: 'setPath'
  readonly value: string
}
interface DropActionSetUri {
  readonly command: 'setUri'
  readonly value: string
}

type DropAction = DropActionOpenFiles | DropActionSetPath | DropActionSetUri

const getDropAction = async (uris: readonly string[]): Promise<DropAction> => {
  for (const uri of uris) {
    if (uri.endsWith('/') || (await isDirectoryEditorInput({ type: 'editor', uri }))) {
      if (uri.startsWith('file://')) {
        return {
          command: 'setUri',
          value: uri,
        }
      }
      return {
        command: 'setPath',
        value: uri,
      }
    }
  }
  return {
    command: 'openFiles',
    uris,
  }
}

const applyDropAction = async (context: AsyncCommandContext<MainAreaState>, action: DropAction, splitDirection: number) => {
  switch (action.command) {
    case 'openFiles': {
      if (action.uris.length > 0 && splitDirection !== EditorSplitDirection.None) {
        await context.updateState((state) => splitForDrop(state, splitDirection))
      }
      await openUrisWithContext(context, action.uris, splitDirection === EditorSplitDirection.None)
      break
    }
    case 'setPath':
      void RendererWorker.invoke('Workspace.setPath', action.value).catch(() => {})
      break
    case 'setUri':
      void RendererWorker.invoke('Workspace.setUri', action.value).catch(() => {})
      break
  }
}

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, itemIds: readonly number[]): Promise<void> => {
  const splitDirection = context.getState().dragOverlay?.splitDirection ?? EditorSplitDirection.None
  await context.updateState(handleDragLeave)
  const { platform } = context.getState()
  const isElectron = platform === PlatformType.Electron
  const { uris } = await DragAndDropWorker.getDroppedItems(itemIds, isElectron)
  const actions = await getDropAction(uris)
  await applyDropAction(context, actions, splitDirection)
}
