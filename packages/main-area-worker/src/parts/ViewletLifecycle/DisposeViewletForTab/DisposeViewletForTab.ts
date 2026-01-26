import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import { findTab } from '../../LoadTabContent/LoadTabContent.ts'
import type { ViewletLifecycleResult } from '../CreateViewletForTab/CreateViewletForTab.ts'

/**
 * Dispose viewlet when tab is closed.
 */
export const disposeViewletForTab = (state: MainAreaState, tabId: number): ViewletLifecycleResult => {
  const tab = findTab(state, tabId)
  if (!tab || tab.viewletInstanceId === undefined) {
    return { commands: [], newState: state }
  }

  const commands = [{ instanceId: tab.viewletInstanceId, type: 'dispose' }] as const

  return { commands, newState: state }
}
