import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getCurrentState } from '../GetCurrentState/GetCurrentState.ts'
import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'
import { getEditorInputTitle } from '../GetEditorInputTitle/GetEditorInputTitle.ts'
import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'
import { getStateWithTab } from '../GetStateWithTab/GetStateWithTab.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import { updateTabIcon } from '../UpdateTabIcon/UpdateTabIcon.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

export const openInputWithContext = async (context: AsyncCommandContext<MainAreaState>, options: OpenInputOptions): Promise<void> => {
  const state = context.getState()
  Assert.object(state)
  Assert.object(options)

  const { editorInput } = options
  const preview = options.preview ?? false
  const uri = getEditorInputUri(editorInput)
  const title = getEditorInputTitle(editorInput)
  const editorType = getEditorInputEditorType(editorInput)
  const currentState = state
  const existingTab = findTabByUri(currentState, uri)
  const shouldRetryExistingTab = !!existingTab && existingTab.tab.loadingState === 'error'
  if (existingTab && !shouldRetryExistingTab) {
    const focusedState = focusEditorGroup(currentState, existingTab.groupId)
    const switchedState = switchTab(focusedState, existingTab.groupId, existingTab.tab.id)
    await context.updateState(() => switchedState)
    return
  }
  const previousTabId = getActiveTabId(currentState)
  const { stateWithTab, tabId } = getStateWithTab(currentState, editorInput, existingTab, shouldRetryExistingTab, uri, preview, title, editorType)

  await context.updateState(() => stateWithTab)

  if (await isDirectoryEditorInput(editorInput)) {
    const latestState = context.getState()
    const errorState = updateTab(latestState, tabId, {
      errorMessage: 'Expected a file but received a folder',
      loadingState: 'error',
    })
    await context.updateState(() => errorState)
    return
  }

  try {
    const viewletModuleId = await getViewletModuleIdForEditorInput(editorInput)
    const stateAfterModuleId = context.getState()

    if (!viewletModuleId) {
      const unsupportedState = updateTab(stateAfterModuleId, tabId, {
        errorMessage: 'Could not determine editor type for this URI',
        loadingState: 'error',
      })
      await context.updateState(() => unsupportedState)
      return
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

    await context.updateState(() => intermediateState)

    const tabWithViewlet = findTabById(intermediateState, tabId)
    if (!tabWithViewlet) {
      return
    }

    const { editorUid } = tabWithViewlet.tab
    if (editorUid === -1) {
      throw new Error('invalid editorUid')
    }

    await createViewlet(viewletModuleId, editorUid, tabId, bounds, uri)

    const latestState = context.getState()
    const readyState = ViewletLifecycle.handleViewletReady(latestState, editorUid)

    await context.updateState(() => readyState)

    const stateWithIcon = await updateTabIcon(context, readyState, tabId)
    if (stateWithIcon) {
      return
    }
  } catch (error) {
    const latestState = context.getState()
    const errorMessage = error instanceof Error ? error.message : 'Failed to open URI'
    const errorState = updateTab(latestState, tabId, {
      errorMessage,
      loadingState: 'error',
    })
    await context.updateState(() => errorState)
  }
}

export const openInput = async (state: MainAreaState, options: OpenInputOptions): Promise<MainAreaState> => {
  const { uid } = state
  let currentState = getCurrentState(state)
  const context: AsyncCommandContext<MainAreaState> = {
    getState: () => get(uid)?.newState ?? currentState,
    updateState: (updater) => {
      const storedState = get(uid)
      const latestState = storedState?.newState ?? currentState
      currentState = updater(latestState)
      set(uid, storedState?.oldState ?? state, currentState)
      return Promise.resolve(currentState)
    },
  }
  await openInputWithContext(context, options)
  return context.getState()
}
