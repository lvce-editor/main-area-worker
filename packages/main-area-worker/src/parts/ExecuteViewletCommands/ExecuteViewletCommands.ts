import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const handleAttach = async (command: Extract<ViewletCommand, { type: 'attach' }>): Promise<void> => {
  // Makes viewlet visible - only call after race condition check
  // @ts-ignore
  await RendererWorker.invoke('Viewlet.attach', command.instanceId)
}

const handleCreate = async (command: Extract<ViewletCommand, { type: 'create' }>, uid?: number): Promise<void> => {
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
  console.warn('did create', uid, instanceId)
  // After viewlet is created, handle the ready state and potentially attach
  if (uid !== undefined && instanceId !== undefined) {
    const { newState: state, oldState } = MainAreaStates.get(uid)
    const { commands: readyCommands, newState } = ViewletLifecycle.handleViewletReady(state, command.requestId, instanceId)
    MainAreaStates.set(uid, oldState, newState)

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

const handleDetach = async (command: Extract<ViewletCommand, { type: 'detach' }>): Promise<void> => {
  // Hides viewlet but keeps it alive
  // @ts-ignore
  await RendererWorker.invoke('Viewlet.detach', command.instanceId)
}

const handleDispose = async (command: Extract<ViewletCommand, { type: 'dispose' }>): Promise<void> => {
  // Fully destroys viewlet
  // @ts-ignore
  await RendererWorker.invoke('Viewlet.dispose', command.instanceId)
}

const handleSetBounds = async (command: Extract<ViewletCommand, { type: 'setBounds' }>): Promise<void> => {
  // @ts-ignore
  await RendererWorker.invoke('Viewlet.setBounds', command.instanceId, command.bounds)
}

export const executeViewletCommands = async (commands: readonly ViewletCommand[], uid?: number): Promise<void> => {
  for (const command of commands) {
    switch (command.type) {
      case 'attach':
        await handleAttach(command)
        break
      case 'create':
        await handleCreate(command, uid)
        break
      case 'detach':
        await handleDetach(command)
        break
      case 'dispose':
        await handleDispose(command)
        break
      case 'setBounds':
        await handleSetBounds(command)
        break
    }
  }
}
