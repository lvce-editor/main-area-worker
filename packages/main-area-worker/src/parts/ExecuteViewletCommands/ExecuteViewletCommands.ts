import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'

export const executeViewletCommands = async (commands: readonly ViewletCommand[]): Promise<void> => {
  for (const command of commands) {
    switch (command.type) {
      case 'attach':
        // Makes viewlet visible - only call after race condition check
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.attach', command.instanceId)
        break
      case 'create':
        // Safe to call - no visible side effects
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.create', command.viewletModuleId, command.requestId, command.tabId, command.bounds, command.uri)
        break
      case 'detach':
        // Hides viewlet but keeps it alive
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.detach', command.instanceId)
        break
      case 'dispose':
        // Fully destroys viewlet
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.dispose', command.instanceId)
        break
      case 'setBounds':
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.setBounds', command.instanceId, command.bounds)
        break
    }
  }
}
