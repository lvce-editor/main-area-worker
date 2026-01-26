import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'
import { findTab, updateTab } from '../../LoadTabContent/LoadTabContent.ts'
import type { ViewletLifecycleResult } from '../CreateViewletForTab/CreateViewletForTab.ts'

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
