import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../ViewletLifecycleResult.ts'
import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'
import { findTabById } from '../../FindTabById/FindTabById.ts'

export const switchViewlet = async (
  state: MainAreaState,
  fromTabId: number | undefined,
  toTabId: number,
  waitForBlur = true,
): Promise<ViewletLifecycleResult> => {
  const previous = fromTabId === undefined ? undefined : findTabById(state, fromTabId)?.tab
  if (fromTabId !== toTabId && previous && previous.editorUid >= 0 && previous.loadingState === 'loaded' && previous.editorInput?.type === 'editor') {
    // Browsers do not consistently emit blur when a focused editor reference is detached.
    const blur = ApplicationRpc.invoke(state.applicationId, 'Viewlet.executeViewletCommand', previous.editorUid, 'handleBlur')
    if (waitForBlur) {
      await blur
    } else {
      // Opening a new editor can originate inside the outgoing editor's command queue.
      // Waiting for blur there would deadlock the navigation command.
      void blur.catch(() => {
        // The outgoing editor may have been disposed while blur was queued.
      })
    }
  }
  return { commands: [], newState: state }
}
