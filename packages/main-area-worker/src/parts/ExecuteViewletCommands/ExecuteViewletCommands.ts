import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const executeViewletCommands = async (commands: readonly ViewletCommand[], uid?: number): Promise<void> => {
  for (const command of commands) {
    switch (command.type) {
      case 'attach':
        // Makes viewlet visible - only call after race condition check
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.attach', command.instanceId)
        break
      case 'create': {
        // Safe to call - no visible side effects
        // @ts-ignore
        const instanceId = Math.random() // TODO try to find a better way to get consistent integer ids (thread safe)

        await RendererWorker.invoke(
          'Layout.createViewlet',
          command.viewletModuleId,
          command.requestId,
          command.tabId,
          command.bounds,
          command.uri,
          instanceId,
        )
        console.log('did create', uid, instanceId)
        // After viewlet is created, handle the ready state and potentially attach
        if (uid !== undefined && instanceId !== undefined) {
          const { newState: state, oldState } = MainAreaStates.get(uid)
          const { commands: readyCommands, newState } = ViewletLifecycle.handleViewletReady(state, command.requestId, instanceId)
          MainAreaStates.set(uid, oldState, newState)

          console.log({ readyCommands })
          // Execute any attach commands that result from handleViewletReady
          for (const readyCommand of readyCommands) {
            if (readyCommand.type === 'attach') {
              // @ts-ignore
              await RendererWorker.invoke('Viewlet.attach', readyCommand.instanceId)
            }
          }
        }
        break
      }
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
