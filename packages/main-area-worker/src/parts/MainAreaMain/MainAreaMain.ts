import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as MainAreaCommandMap from '../MainAreaCommandMap/MainAreaCommandMap.ts'
import { registerCommands } from '../MainAreaStates/MainAreaStates.ts'

export const main = async (): Promise<void> => {
  registerCommands(MainAreaCommandMap.mainAreaCommandMap)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: MainAreaCommandMap.mainAreaCommandMap,
  })
  RendererWorker.set(rpc)
}
