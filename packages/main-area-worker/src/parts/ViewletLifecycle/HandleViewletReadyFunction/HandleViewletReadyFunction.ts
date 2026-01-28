import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../CreateViewletForTab/CreateViewletForTab.ts'
import { updateTab } from '../../LoadTabContent/LoadTabContent.ts'

/**
 * Called when renderer reports viewlet finished creating.
 * With reference nodes, attachment is handled automatically by virtual DOM rendering.
 * No commands needed - state update is sufficient.
 */
export const handleViewletReady = (state: MainAreaState, editorUid: number, instanceId: number): ViewletLifecycleResult => {
  // Find the tab by editorUid
  const { layout } = state
  const { groups } = layout
  let tab
  for (const group of groups) {
    const foundTab = group.tabs.find((t) => t.editorUid === editorUid)
    if (foundTab) {
      tab = foundTab
      break
    }
  }

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
    viewletState: 'ready',
  })

  // No attach commands needed - virtual DOM reference nodes handle positioning
  return { commands: [], newState }
}
