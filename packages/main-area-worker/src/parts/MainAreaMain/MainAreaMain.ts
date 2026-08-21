import { WebWorkerRpcClient2 } from '@lvce-editor/rpc'
import { commandMap } from '../CommandMap/CommandMap.ts'
import * as Main from '../Main/Main.ts'
import { registerCommands } from '../MainAreaStates/MainAreaStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const initialize = async (_type: string, port: MessagePort): Promise<void> => {
  await Main.main(port)
}

export const main = async (): Promise<void> => {
  registerCommands(commandMap)
  const rpc = await WebWorkerRpcClient2.create({
    commandMap: {
      ...commandMap,
      initialize,
    },
  })
  RendererProcess.set(rpc)
}
