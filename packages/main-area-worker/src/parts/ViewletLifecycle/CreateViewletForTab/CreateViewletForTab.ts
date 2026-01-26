import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { Bounds, ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'
import * as GetNextRequestId from '../../GetNextRequestId/GetNextRequestId.ts'
import { findTab, updateTab } from '../../LoadTabContent/LoadTabContent.ts'

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
