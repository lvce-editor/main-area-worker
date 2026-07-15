import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const handleCreate = async (command: Extract<ViewletCommand, { type: 'create' }>): Promise<MainAreaState> => {
  // Safe to call - no visible side effects

  const title = await createViewlet(command.viewletModuleId, command.editorUid, command.tabId, command.bounds, command.uri || '')

  // After viewlet is created, mark it as ready
  // Attachment is handled automatically by virtual DOM reference nodes
  const { newState: state, oldState } = MainAreaStates.get(command.uid)

  const readyState = ViewletLifecycle.handleViewletReady(state, command.editorUid, title)
  MainAreaStates.set(command.uid, oldState, readyState)
  return readyState
}
