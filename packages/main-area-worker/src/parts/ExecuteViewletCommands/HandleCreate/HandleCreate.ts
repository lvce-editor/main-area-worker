import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'
import * as MainAreaStates from '../../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../../ViewletLifecycle/ViewletLifecycle.ts'

export const handleCreate = async (command: Extract<ViewletCommand, { type: 'create' }>): Promise<MainAreaState> => {
  // Safe to call - no visible side effects
  // @ts-ignore
  const instanceId = Math.random() // TODO try to find a better way to get consistent integer ids (thread safe)

  await RendererWorker.invoke('Layout.createViewlet', command.viewletModuleId, command.tabId, command.bounds, command.uri, instanceId)

  // After viewlet is created, mark it as ready
  // Attachment is handled automatically by virtual DOM reference nodes
  const { newState: state, oldState } = MainAreaStates.get(command.uid)

  const readyState = ViewletLifecycle.handleViewletReady(state, command.editorUid)
  MainAreaStates.set(command.uid, oldState, readyState)
  return readyState
}
