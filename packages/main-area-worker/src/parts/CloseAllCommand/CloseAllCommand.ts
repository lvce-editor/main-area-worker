import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'

type CloseFunction = (state: MainAreaState, ...args: any[]) => Promise<MainAreaState>

export const closeAllCommand = async (close: CloseFunction, state: MainAreaState, ...args: any[]): Promise<MainAreaState> => {
  const editorUids = state.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid)).filter((uid) => uid !== -1)
  const newState = await close(state, ...args)
  if (newState === state) {
    return newState
  }
  const storedState = get(state.uid)
  set(state.uid, storedState?.oldState ?? state, newState)
  try {
    await ApplicationRpc.invoke(state.applicationId, 'Layout.renderMainAreaPending', state.uid)
  } catch {
    // Older renderer workers render the final state when the command completes.
  }
  await Promise.all(
    editorUids.map(async (editorUid) => {
      try {
        await RendererWorker.invoke('Viewlet.dispose', editorUid)
      } catch {
        // Ignore missing or already disposed viewlets.
      }
    }),
  )
  return newState
}
