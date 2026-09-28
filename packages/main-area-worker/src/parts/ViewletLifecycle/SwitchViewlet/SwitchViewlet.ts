import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../ViewletLifecycleResult.ts'
import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'
import { findTabById } from '../../FindTabById/FindTabById.ts'

export const switchViewlet = async (state: MainAreaState, fromTabId: number | undefined, toTabId: number): Promise<ViewletLifecycleResult> => {
  const previous = fromTabId === undefined ? undefined : findTabById(state, fromTabId)?.tab
  if (fromTabId !== toTabId && previous && previous.editorUid >= 0 && previous.loadingState === 'loaded' && previous.editorInput?.type === 'editor') {
    // Browsers do not consistently emit blur when a focused editor reference is detached.
    // Navigation may be awaiting this switch inside the outgoing editor's command queue.
    // Enqueue blur without waiting for that queue to drain.
    void ApplicationRpc.invoke(state.applicationId, 'Viewlet.executeViewletCommand', previous.editorUid, 'handleBlur').catch(() => {
      // The outgoing editor may have been disposed while blur was queued.
    })
  }
  return { commands: [], newState: state }
}
