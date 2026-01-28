import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../ViewletLifecycleResult.ts'
import { findTab } from '../../LoadTabContent/LoadTabContent.ts'

/**
 * Dispose viewlet when tab is closed.
 */
export const disposeViewletForTab = (state: MainAreaState, tabId: number): ViewletLifecycleResult => {
  const tab = findTab(state, tabId)
  if (!tab || !tab.viewletInstanceId) {
    return { commands: [], newState: state }
  }

  const commands: readonly ViewletCommand[] = [{ instanceId: tab.editorUid, type: 'dispose' }]

  return { commands, newState: state }
}
