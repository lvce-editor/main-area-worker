import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../ViewletLifecycleResult.ts'
import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'
import { findTabById } from '../../FindTabById/FindTabById.ts'

export const switchViewlet = async (state: MainAreaState, fromTabId: number | undefined, toTabId: number): Promise<ViewletLifecycleResult> => {
  const previous = fromTabId === undefined ? undefined : findTabById(state, fromTabId)?.tab
  if (fromTabId !== toTabId && previous && previous.editorUid >= 0 && previous.loadingState === 'loaded' && previous.editorInput?.type === 'editor') {
    // Browsers do not consistently emit blur when a focused editor reference is detached.
    await ApplicationRpc.invoke(state.applicationId, 'Viewlet.executeViewletCommand', previous.editorUid, 'handleBlur')
  }
  return { commands: [], newState: state }
}
