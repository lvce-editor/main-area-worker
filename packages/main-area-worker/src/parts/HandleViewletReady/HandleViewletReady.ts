import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ExecuteViewletCommands from '../ExecuteViewletCommands/ExecuteViewletCommands.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

/**
 * Handler called when RendererWorker reports that a viewlet has finished creating.
 * This is where the race condition is handled - we only attach if the tab is still active.
 *
 * @param uid - The main area worker unique ID
 * @param requestId - The viewlet request ID (for race condition detection)
 * @param instanceId - The viewlet instance ID assigned by RendererWorker
 */
export const handleViewletReady = async (uid: number, requestId: number, instanceId: number): Promise<void> => {
  const { newState: state, oldState } = MainAreaStates.get(uid)

  // This is where race condition is handled - only attach if tab still active
  const { commands, newState } = ViewletLifecycle.handleViewletReady(state, requestId, instanceId)

  MainAreaStates.set(uid, oldState, newState)
  await ExecuteViewletCommands.executeViewletCommands(commands)
}

/**
 * Handler called when a viewlet reports an error during creation.
 *
 * @param uid - The main area worker unique ID
 * @param requestId - The viewlet request ID
 * @param errorMessage - The error message
 */
export const handleViewletError = async (uid: number, requestId: number, errorMessage: string): Promise<void> => {
  const { newState: state, oldState } = MainAreaStates.get(uid)

  // Find the tab that made this request and update its state
  const { layout } = state
  const { groups } = layout

  let updatedState: MainAreaState = state
  for (const group of groups) {
    const tab = group.tabs.find((t) => t.viewletRequestId === requestId)
    if (tab) {
      const updatedTabs = group.tabs.map((t) => {
        if (t.id === tab.id) {
          return {
            ...t,
            errorMessage,
            viewletState: 'error' as const,
          }
        }
        return t
      })
      const updatedGroups = groups.map((g) => {
        if (g.id === group.id) {
          return { ...g, tabs: updatedTabs }
        }
        return g
      })
      updatedState = {
        ...state,
        layout: {
          ...layout,
          groups: updatedGroups,
        },
      }
      break
    }
  }

  MainAreaStates.set(uid, oldState, updatedState)
}
