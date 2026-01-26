import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../CreateViewletForTab/CreateViewletForTab.ts'
import { findTabByViewletRequestId } from '../../FindTabByViewletRequestId/FindTabByViewletRequestId.ts'
import { isTabActive } from '../../IsTabActive/IsTabActive.ts'
import { updateTab } from '../../LoadTabContent/LoadTabContent.ts'

/**
 * Called when renderer reports viewlet finished creating.
 * CRITICAL: Only attach if this tab is still active - this is where the race condition is handled.
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
  let newState = updateTab(state, tab.id, {
    viewletInstanceId: instanceId,
    viewletState: 'ready',
  })

  // RACE CONDITION CHECK: Only attach if this tab is currently active
  const tabIsActive = isTabActive(state, tab.id)

  if (tabIsActive) {
    newState = updateTab(newState, tab.id, { isAttached: true })
    return {
      commands: [{ instanceId, type: 'attach' }],
      newState,
    }
  }

  // Tab is not active - viewlet is ready but stays detached
  // Will be attached when user switches to this tab
  return { commands: [], newState }
}
