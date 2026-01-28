import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../CreateViewletForTab/CreateViewletForTab.ts'
import { findTabByViewletRequestId } from '../../FindTabByViewletRequestId/FindTabByViewletRequestId.ts'
import { updateTab } from '../../LoadTabContent/LoadTabContent.ts'

/**
 * Called when renderer reports viewlet finished creating.
 * With reference nodes, attachment is handled automatically by virtual DOM rendering.
 * No commands needed - state update is sufficient.
 */
export const handleViewletReady = (state: MainAreaState, requestId: number, instanceId: number): ViewletLifecycleResult => {
  // Find the tab that made this request
  const tab = findTabByViewletRequestId(state, requestId)

  if (!tab) {
    // Tab was closed, dispose viewlet
    return {
      commands: [{ instanceId, type: 'dispose' }],
      newState: state,
    }
  }

  // Mark viewlet as ready
  // Reference nodes will handle rendering at the correct position automatically
  const newState = updateTab(state, tab.id, {
    viewletInstanceId: instanceId,
    viewletState: 'ready',
  })

  // No attach commands needed - virtual DOM reference nodes handle positioning
  return { commands: [], newState }
}
