import { LazyTransferElectronMessagePortRpc } from '@lvce-editor/rpc'
import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import { sendMessagePortToClipBoardWorker } from '../SendMessagePortToExtensionClipBoardWorker/SendMessagePortToClipBoardWorker.ts'

export const initializeClipBoardWorker = async (): Promise<void> => {
  const rpc = await LazyTransferElectronMessagePortRpc.create({
    commandMap: {},
    send: sendMessagePortToClipBoardWorker,
  })
  ClipBoardWorker.set(rpc)
}
