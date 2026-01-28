import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import { findTabByEditorUid } from '../../FindTabByEditorUid/FindTabByEditorUid.ts'
import { updateTab } from '../../LoadTabContent/LoadTabContent.ts'

/**
 * Called when renderer reports viewlet finished creating.
 * With reference nodes, attachment is handled automatically by virtual DOM rendering.
 * No commands needed - state update is sufficient.
 */
export const handleViewletReady = (state: MainAreaState, editorUid: number): MainAreaState => {
  // Find the tab by viewletRequestId
  const tab = findTabByEditorUid(state, editorUid)

  if (!tab) {
    // Tab was closed, dispose viewlet
    return state
  }

  // Mark viewlet as ready and set instance id
  // Reference nodes will handle rendering at the correct position automatically
  const newState = updateTab(state, tab.id, {
    editorUid: editorUid,
    loadingState: 'loaded',
  })

  // No attach commands needed - virtual DOM reference nodes handle positioning
  return newState
}
