import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToClipBoardWorker = async (port: MessagePort): Promise<void> => {
  // @ts-ignore
  await RendererWorker.sendMessagePortToClipBoardWorker(port, 0)
}
