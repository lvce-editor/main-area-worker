import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getCurrentState } from '../GetCurrentState/GetCurrentState.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'
import { getEditorInputTitle } from '../GetEditorInputTitle/GetEditorInputTitle.ts'
import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'
import { getStateWithTab } from '../GetStateWithTab/GetStateWithTab.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import { updateTabIcon } from '../UpdateTabIcon/UpdateTabIcon.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const openInput = async (state: MainAreaState, options: OpenInputOptions): Promise<MainAreaState> => {
  Assert.object(state)
  Assert.object(options)

  const { uid } = state
  const { editorInput } = options
  const preview = options.preview ?? false
  const uri = getEditorInputUri(editorInput)
  const title = getEditorInputTitle(editorInput)
  const editorType = getEditorInputEditorType(editorInput)
  const currentState = getCurrentState(state)

<<<<<<< Updated upstream
  const currentState = getCurrentState(state)
=======
>>>>>>> Stashed changes
  const existingTab = findTabByUri(currentState, uri)
  const shouldRetryExistingTab = !!existingTab && existingTab.tab.loadingState === 'error'
  if (existingTab && !shouldRetryExistingTab) {
    const focusedState = focusEditorGroup(currentState, existingTab.groupId)
    return switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
  }

<<<<<<< Updated upstream
  const previousTabId = getActiveTabId(currentState)
=======
  const previousTabId = getActiveTabId(state)
>>>>>>> Stashed changes
  const { stateWithTab, tabId } = getStateWithTab(currentState, editorInput, existingTab, shouldRetryExistingTab, uri, preview, title, editorType)

  set(uid, state, stateWithTab)

  if (await isDirectoryEditorInput(editorInput)) {
    const { newState: latestState } = get(uid)
    const errorState = updateTab(latestState, tabId, {
      errorMessage: 'Expected a file but received a folder',
      loadingState: 'error',
    })
    set(uid, state, errorState)
    return errorState
  }

  try {
    const viewletModuleId = await getViewletModuleIdForEditorInput(editorInput)
    const { newState: stateAfterModuleId } = get(uid)

    if (!viewletModuleId) {
      return updateTab(stateAfterModuleId, tabId, {
        errorMessage: 'Could not determine editor type for this URI',
        loadingState: 'error',
      })
    }

    const bounds = {
      height: stateAfterModuleId.height - stateAfterModuleId.tabHeight,
      width: stateAfterModuleId.width,
      x: stateAfterModuleId.x,
      y: stateAfterModuleId.y + stateAfterModuleId.tabHeight,
    }
    const stateWithViewlet = ViewletLifecycle.createViewletForTab(stateAfterModuleId, tabId, viewletModuleId, bounds)
    let intermediateState = stateWithViewlet

    const { newState: switchedState } = ViewletLifecycle.switchViewlet(intermediateState, previousTabId, tabId)
    intermediateState = switchedState

    set(uid, state, intermediateState)

    const tabWithViewlet = findTabById(intermediateState, tabId)
    if (!tabWithViewlet) {
      return intermediateState
    }

    const { editorUid } = tabWithViewlet.tab
    if (editorUid === -1) {
      throw new Error('invalid editorUid')
    }

    await createViewlet(viewletModuleId, editorUid, tabId, bounds, uri)

    const { newState: latestState } = get(uid)
    const readyState = ViewletLifecycle.handleViewletReady(latestState, editorUid)

    set(uid, state, readyState)

    const stateWithIcon = await updateTabIcon(uid, state, readyState, tabId)
    if (stateWithIcon) {
      return stateWithIcon
    }

    const { newState: finalState } = get(uid)
    return finalState
  } catch (error) {
    const { newState: latestState } = get(uid)
    const errorMessage = error instanceof Error ? error.message : 'Failed to open URI'
    const errorState = updateTab(latestState, tabId, {
      errorMessage,
      loadingState: 'error',
    })
    set(uid, state, errorState)
    return errorState
  }
}
