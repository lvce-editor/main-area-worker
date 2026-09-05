import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as Assert from '../Assert/Assert.ts'
import { createViewletContent, getViewletTitle } from '../CreateViewlet/CreateViewlet.ts'
import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { findTabByUri } from '../FindTabByUri/FindTabByUri.ts'
import { focus as focusMainArea } from '../Focus/Focus.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getCurrentState } from '../GetCurrentState/GetCurrentState.ts'
import { getEditorInputTitle } from '../GetEditorInputTitle/GetEditorInputTitle.ts'
import { getEditorInputUri } from '../GetEditorInputUri/GetEditorInputUri.ts'
import { getLargeFileSize } from '../GetLargeFileSize/GetLargeFileSize.ts'
import { getStateWithTab } from '../GetStateWithTab/GetStateWithTab.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import { getSelectedTabBounds } from '../SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import { updateTabIcon } from '../UpdateTabIcon/UpdateTabIcon.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const renderMainAreaPending = async (uid: number, applicationId?: string): Promise<void> => {
  try {
    await ApplicationRpc.invoke(applicationId, 'Layout.renderMainAreaPending', uid)
  } catch {
    // Older renderer workers render the final state when openInput completes.
  }
}

const focusIfRequested = async (state: MainAreaState, shouldFocus: boolean): Promise<void> => {
  if (shouldFocus) {
    await focusMainArea(state)
  }
}

const getExistingTabState = (state: MainAreaState, existingTab: NonNullable<ReturnType<typeof findTabByUri>>, preview: boolean): MainAreaState => {
  const focusedState = focusEditorGroup(state, existingTab.groupId)
  const pinnedState = !preview && existingTab.tab.isPreview ? updateTab(focusedState, existingTab.tab.id, { isPreview: false }) : focusedState
  return switchTab(pinnedState, existingTab.groupId, existingTab.tab.id)
}

const getActivePreviewEditorUid = (state: MainAreaState): number => {
  const { layout } = state
  const { activeGroupId, groups } = layout
  const activeGroup = activeGroupId === -1 ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)
  const activeTab = activeGroup?.tabs.find((tab) => tab.id === activeGroup.activeTabId)
  return activeTab?.isPreview ? activeTab.editorUid : -1
}

const shouldRetryExistingTab = (
  existingTab: ReturnType<typeof findTabByUri>,
  editorInput: OpenInputOptions['editorInput'],
  forceOpen: boolean,
): boolean => {
  if (!existingTab) {
    return false
  }
  return (
    existingTab.tab.loadingState === 'error' ||
    (forceOpen && existingTab.tab.loadingState === 'large') ||
    (editorInput.type === 'editor' && editorInput.forceText === true && existingTab.tab.editorInput?.type === 'binary')
  )
}

export const openInputWithContext = async (context: AsyncCommandContext<MainAreaState>, options: OpenInputOptions): Promise<void> => {
  const state = context.getState()
  Assert.object(state)
  Assert.object(options)

  const { editorInput } = options
  const preview = options.preview ?? false
  const uri = getEditorInputUri(editorInput)
  const title = getEditorInputTitle(editorInput)
  const currentState = state
  const existingTab = options.reuseExisting === false ? undefined : findTabByUri(currentState, uri)
  const shouldRetry = shouldRetryExistingTab(existingTab, editorInput, options.forceOpen === true)
  if (existingTab && !shouldRetry) {
    const switchedState = getExistingTabState(currentState, existingTab, preview)
    await context.updateState(() => switchedState)
    await focusIfRequested(switchedState, options.focus)
    return
  }
  const replacedEditorUid = getActivePreviewEditorUid(currentState)
  const previousTabId = getActiveTabId(currentState)
  const { stateWithTab, tabId } = getStateWithTab(currentState, editorInput, existingTab, shouldRetry, uri, preview, title)

  await context.updateState(() => stateWithTab)
  if (replacedEditorUid !== -1) {
    await disposeEditors([replacedEditorUid])
  }

  if (await isDirectoryEditorInput(editorInput, state.applicationId)) {
    const latestState = context.getState()
    const errorState = updateTab(latestState, tabId, {
      errorMessage: 'Expected a file but received a folder',
      loadingState: 'error',
    })
    await context.updateState(() => errorState)
    return
  }

  if (editorInput.type === 'binary') {
    const latestState = context.getState()
    const binaryState = updateTab(latestState, tabId, {
      editorUid: -1,
      loadingState: 'binary',
    })
    await context.updateState(() => binaryState)
    return
  }

  const fileSize = await getLargeFileSize(editorInput, options.forceOpen === true, state.applicationId)
  if (fileSize !== undefined) {
    const latestState = context.getState()
    const largeFileState = updateTab(latestState, tabId, {
      editorUid: -1,
      fileSize,
      loadingState: 'large',
    })
    await context.updateState(() => largeFileState)
    return
  }

  try {
    const viewletModuleId = await getViewletModuleIdForEditorInput(editorInput, state.applicationId)
    const stateAfterModuleId = context.getState()

    if (!viewletModuleId) {
      const unsupportedState = updateTab(stateAfterModuleId, tabId, {
        errorMessage: 'Could not determine editor type for this URI',
        loadingState: 'error',
      })
      await context.updateState(() => unsupportedState)
      return
    }

    const tabLocation = findTabById(stateAfterModuleId, tabId)
    const bounds = getSelectedTabBounds(stateAfterModuleId, tabLocation?.groupId)
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

    await createViewletContent(viewletModuleId, editorUid, tabId, bounds, uri, options.args, state.applicationId)

    const latestState = context.getState()
    let readyState = ViewletLifecycle.handleViewletReady(latestState, editorUid)

    await context.updateState(() => readyState)
    await renderMainAreaPending(state.uid, state.applicationId)
    await focusIfRequested(context.getState(), options.focus)

    const renderedTitle = await getViewletTitle(editorUid)
    if (renderedTitle) {
      readyState = ViewletLifecycle.handleViewletReady(context.getState(), editorUid, renderedTitle)
      await context.updateState(() => readyState)
    }

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
