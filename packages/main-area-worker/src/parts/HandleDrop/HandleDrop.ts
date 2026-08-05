import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { PlatformType } from '@lvce-editor/constants'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { handleDragLeave } from '../HandleDragLeave/HandleDragLeave.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { openUrisWithContext } from '../OpenUris/OpenUris.ts'

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

const applyDropAction = async (context: AsyncCommandContext<MainAreaState>, action: DropAction) => {
  switch (action.command) {
    case 'openFiles':
      await openUrisWithContext(context, action.uris)
      break
    case 'setPath':
      void RendererWorker.invoke('Workspace.setPath', action.value).catch(() => {})
      break
    case 'setUri':
      void RendererWorker.invoke('Workspace.setUri', action.value).catch(() => {})
      break
    default:
      break
  }
}

export const handleDrop = async (context: AsyncCommandContext<MainAreaState>, itemIds: readonly number[]): Promise<void> => {
  await context.updateState(handleDragLeave)
  const { platform } = context.getState()
  const isElectron = platform === PlatformType.Electron
  const { uris } = await DragAndDropWorker.getDroppedItems(itemIds, isElectron)
  const actions = await getDropAction(uris)
  await applyDropAction(context, actions)
}
