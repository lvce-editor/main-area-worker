import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { Bounds } from '../../ViewletCommand/ViewletCommand.ts'
import * as Id from '../../Id/Id.ts'
import { findTab, updateTab } from '../../LoadTabContent/LoadTabContent.ts'

/**
 * SAFE: Create viewlet for a tab (no visible side effects)
 * Can be called eagerly when tab is opened - the viewlet loads in the background.
 */
export const createViewletForTab = (state: MainAreaState, tabId: number, viewletModuleId: string, bounds: Bounds): MainAreaState => {
  const tab = findTab(state, tabId)
  if (!tab) {
    return state
  }

  // If tab already has an editorUid, don't recreate
  if (tab.editorUid !== -1) {
    return state
  }

  const editorUid = Id.create()

  const newState = updateTab(state, tabId, {
    editorUid,
  })

  return newState
}
