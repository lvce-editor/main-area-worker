import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { initializeClipBoardWorker } from '../InitializeClipBoardWorker/InitializeClipBoardWorker.ts'
import { initializeDragAndDropWorker } from '../InitializeDragAndDropWorker/InitializeDragAndDropWorker.ts'
import { initializeIconThemeWorker } from '../InitializeIconThemeWorker/InitializeIconThemeWorker.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/InitializeRendererWorker.ts'
import { registerCommands } from '../MainAreaStates/MainAreaStates.ts'

export const listen = async (port: MessagePort): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([initializeRendererWorker(port), initializeIconThemeWorker(), initializeClipBoardWorker(), initializeDragAndDropWorker()])
  const dialogRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: RendererWorker.sendMessagePortToDialogWorker,
  })
  DialogWorker.set(dialogRpc)
}
