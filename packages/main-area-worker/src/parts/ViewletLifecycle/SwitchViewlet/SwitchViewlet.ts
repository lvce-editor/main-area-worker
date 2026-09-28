import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../ViewletLifecycleResult.ts'
import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'
import { findTabById } from '../../FindTabById/FindTabById.ts'
import * as Logger from '../../Logger/Logger.ts'

export const switchViewlet = async (
  state: MainAreaState,
  fromTabId: number | undefined,
  toTabId: number,
  awaitBlur = true,
): Promise<ViewletLifecycleResult> => {
  const previous = fromTabId === undefined ? undefined : findTabById(state, fromTabId)?.tab
  if (fromTabId !== toTabId && previous && previous.editorUid >= 0 && previous.loadingState === 'loaded' && previous.editorInput?.type === 'editor') {
    // Browsers do not consistently emit blur when a focused editor reference is detached.
    const blur = ApplicationRpc.invoke(state.applicationId, 'Viewlet.executeViewletCommand', previous.editorUid, 'handleBlur')
    if (awaitBlur) {
      await blur
    } else {
      void blur.catch((error) => {
        Logger.warn(`Failed to blur outgoing editor: ${error}`)
      })
    }
  }
  return { commands: [], newState: state }
}
