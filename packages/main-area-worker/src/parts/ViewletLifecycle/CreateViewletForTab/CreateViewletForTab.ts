import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { Bounds, ViewletCommand } from '../../ViewletCommand/ViewletCommand.ts'
import * as Id from '../../Id/Id.ts'
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
  if (tab.editorUid) {
    return { commands: [], newState: state }
  }

  const editorUid = Id.create()

  const commands: ViewletCommand[] = [
    {
      bounds,
      editorUid,
      tabId,
      type: 'create',
      uid: state.uid,
      uri: tab.path,
      viewletModuleId,
    },
  ]

  const newState = updateTab(state, tabId, {
    editorUid,
  })

  return { commands, newState }
}
