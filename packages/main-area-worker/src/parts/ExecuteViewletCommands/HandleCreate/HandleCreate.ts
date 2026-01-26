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
  console.warn('did create', command.uid, instanceId)
  // After viewlet is created, handle the ready state and potentially attach
  if (command.uid !== undefined && instanceId !== undefined) {
    const { newState: state, oldState } = MainAreaStates.get(command.uid)
    
    // Debug: Check if tab exists
    const allTabs: any[] = []
    for (const g of state.layout.groups) {
      for (const t of g.tabs) {
        allTabs.push({ id: t.id, viewletRequestId: t.viewletRequestId, viewletState: t.viewletState })
      }
    }
    console.warn('All tabs in state:', allTabs, 'Looking for requestId:', command.requestId)
    
    const { commands: readyCommands, newState } = ViewletLifecycle.handleViewletReady(state, command.requestId, instanceId)
    MainAreaStates.set(command.uid, oldState, newState)

    console.warn({ readyCommands })
    // Execute any attach commands that result from handleViewletReady
    for (const readyCommand of readyCommands) {
      if (readyCommand.type === 'attach') {
        // @ts-ignore
        await RendererWorker.invoke('Viewlet.attach', readyCommand.instanceId)
      }
    }
  }
}
