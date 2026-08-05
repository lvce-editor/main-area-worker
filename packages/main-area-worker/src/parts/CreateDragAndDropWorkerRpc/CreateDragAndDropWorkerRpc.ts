import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const send = async (port: MessagePort): Promise<void> => {
  await RendererWorker.sendMessagePortToDragAndDropWorker(port)
}

export const createDragAndDropWorkerRpc = async (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({ commandMap: {}, send })
}
