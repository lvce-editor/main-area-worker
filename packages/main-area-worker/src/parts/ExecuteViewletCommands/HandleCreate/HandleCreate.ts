import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'
import * as MainAreaStates from '../../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../../ViewletLifecycle/ViewletLifecycle.ts'

export const handleCreate = async (command: Extract<ViewletCommand, { type: 'create' }>): Promise<void> => {
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

  // After viewlet is created, mark it as ready and attach if needed
  const { newState: state, oldState } = MainAreaStates.get(command.uid)

  const { commands: readyCommands, newState } = ViewletLifecycle.handleViewletReady(state, command.requestId, instanceId)
  MainAreaStates.set(command.uid, oldState, newState)

  // Execute any attach commands that result from handleViewletReady
  for (const readyCommand of readyCommands) {
    if (readyCommand.type === 'attach') {
      // @ts-ignore
      await RendererWorker.invoke('Viewlet.attach', readyCommand.instanceId)
    }
  }
}
