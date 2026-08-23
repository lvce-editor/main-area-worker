import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const send = async (port: MessagePort): Promise<void> => {
  await RendererProcess.invokeAndTransfer('DragAndDrop.handleMessagePort', port)
}

export const createDragAndDropWorkerRpc = async (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({ commandMap: {}, send })
}
