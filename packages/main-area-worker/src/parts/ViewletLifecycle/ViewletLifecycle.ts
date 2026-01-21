import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Bounds, ViewletCommand } from '../ViewletCommand/ViewletCommand.ts'
import { findTabByViewletRequestId } from '../FindTabByViewletRequestId/FindTabByViewletRequestId.ts'
import * as GetNextRequestId from '../GetNextRequestId/GetNextRequestId.ts'
import { isTabActive } from '../IsTabActive/IsTabActive.ts'
import { findTab, updateTab } from '../LoadTabContent/LoadTabContent.ts'

export interface ViewletLifecycleResult {
  readonly commands: readonly ViewletCommand[]
  readonly newState: MainAreaState
}

/**
 * SAFE: Create viewlet for a tab (no visible side effects)
 * Can be called eagerly when tab is opened - the viewlet loads in the background.
 */
export const createViewletForTab = (state: MainAreaState, tabId: number, viewletModuleId: string, bounds: Bounds): ViewletLifecycleResult => {
  const tab = findTab(state, tabId)
  if (!tab) {
    return { commands: [], newState: state }
  }

  // Already has a viewlet being created or ready? Don't recreate
  if (tab.viewletState === 'creating' || tab.viewletState === 'ready') {
    return { commands: [], newState: state }
  }

  const viewletRequestId = GetNextRequestId.getNextRequestId()

  const commands: ViewletCommand[] = [
    {
      bounds,
      requestId: viewletRequestId,
      tabId,
      type: 'create',
      uri: tab.path,
      viewletModuleId,
    },
  ]

  const newState = updateTab(state, tabId, {
    viewletRequestId,
    viewletState: 'creating',
  })

  return { commands, newState }
}

/**
 * Called when switching tabs - detach old viewlet, attach new one (if ready).
 * The race condition check happens here: only attach if the viewlet is ready.
 */
export const switchViewlet = (state: MainAreaState, fromTabId: number | undefined, toTabId: number): ViewletLifecycleResult => {
  const commands: ViewletCommand[] = []

  // Detach old viewlet (if any and if attached)
  if (fromTabId !== undefined) {
    const fromTab = findTab(state, fromTabId)
    if (fromTab?.viewletInstanceId !== undefined && fromTab.isAttached) {
      commands.push({ instanceId: fromTab.viewletInstanceId, type: 'detach' })
    }
  }

  // Attach new viewlet (only if ready and not already attached)
  const toTab = findTab(state, toTabId)
  if (toTab?.viewletState === 'ready' && toTab.viewletInstanceId !== undefined && !toTab.isAttached) {
    commands.push({ instanceId: toTab.viewletInstanceId, type: 'attach' })
  }

  // Update isAttached flags
  let newState = state
  if (fromTabId !== undefined) {
    newState = updateTab(newState, fromTabId, { isAttached: false })
  }
  if (toTab?.viewletState === 'ready') {
    newState = updateTab(newState, toTabId, { isAttached: true })
  }

  return { commands, newState }
}

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

/**
 * Dispose viewlet when tab is closed.
 */
export const disposeViewletForTab = (state: MainAreaState, tabId: number): ViewletLifecycleResult => {
  const tab = findTab(state, tabId)
  if (!tab || tab.viewletInstanceId === undefined) {
    return { commands: [], newState: state }
  }

  const commands: ViewletCommand[] = [{ instanceId: tab.viewletInstanceId, type: 'dispose' }]

  return { commands, newState: state }
}
