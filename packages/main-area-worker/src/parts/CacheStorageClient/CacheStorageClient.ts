import type { Rpc } from '@lvce-editor/rpc'
import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const state: { rpc?: Rpc } = {}

const send = async (port: MessagePort): Promise<void> => {
  await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToCacheWorker', port)
}

export const initialize = async (): Promise<void> => {
  state.rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    isMessagePortOpen: false,
    send,
  })
}

export const invoke = async (command: string, ...args: readonly unknown[]): Promise<unknown> => {
  if (!state.rpc) {
    throw new Error('Cache worker is not initialized')
  }
  return state.rpc.invoke(command, ...args)
}

export const set = (value: Rpc | undefined): Rpc | undefined => {
  const previous = state.rpc
  state.rpc = value
  return previous
}
