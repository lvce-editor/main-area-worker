import * as CommandMap from '../CommandMap/CommandMap.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/InitializeRendererWorker.ts'
import { registerCommands } from '../MainAreaStates/MainAreaStates.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await initializeRendererWorker()
}
