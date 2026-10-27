import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenInputOptions } from '../OpenInputOptions/OpenInputOptions.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { applyInitialCursorPosition } from '../ApplyInitialCursorPosition/ApplyInitialCursorPosition.ts'
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
import { getNextRequestId } from '../GetNextRequestId/GetNextRequestId.ts'
import { getStateWithTab } from '../GetStateWithTab/GetStateWithTab.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { isDirectoryEditorInput } from '../IsDirectoryEditorInput/IsDirectoryEditorInput.ts'
import { get, set } from '../MainAreaStates/MainAreaStates.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { prepareTabIcon } from '../PrepareTabIcon/PrepareTabIcon.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import { getSelectedTabBounds } from '../SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'
import { switchTab } from '../SwitchTab/SwitchTab.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

const renderMainAreaPending = async (uid: number, applicationId?: string): Promise<void> => {
  try {
    await ApplicationRpc.invoke(applicationId, 'Layout.renderMainAreaPending', uid)
  } catch {
    // Older renderer workers render the final state when openInput completes.
  }
}

const runLoadContentLater = async (editorUid: number): Promise<void> => {
  try {
    await RendererWorker.invoke('Viewlet.runLoadContentLater', editorUid)
  } catch {
    // Older renderers start optional providers during creation instead.
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
  const activeGroup = activeGroupId === -1 ? groups.find((group) => group.isFocused) : groups.find((group) => group.id === activeGroupId)
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
    (existingTab.tab.editorUid === -1 &&
      (existingTab.tab.loadingState === undefined || existingTab.tab.loadingState === 'idle' || existingTab.tab.loadingState === 'loaded')) ||
    existingTab.tab.loadingState === 'error' ||
    (forceOpen && existingTab.tab.loadingState === 'large') ||
    (editorInput.type === 'editor' && editorInput.forceText === true && existingTab.tab.editorInput?.type === 'binary')
  )
}

const getViewletArgs = (options: OpenInputOptions): readonly unknown[] | undefined => {
  if (options.editorInput.type !== 'editor') {
    return options.args
  }
  const [viewletContext, ...rest] = options.args || []
  const context = viewletContext && typeof viewletContext === 'object' ? viewletContext : {}
  return [
    {
      ...context,
      deferLoadContentLater: true,
      focus: options.focus,
      ...(options.editorInput.type === 'editor' && options.editorInput.forceText === true && { forceText: true }),
      ...(options.forceOpen === true && { largeFile: true }),
    },
    ...rest,
  ]
}

const handleOpenError = async (
  context: AsyncCommandContext<MainAreaState>,
  tabId: number,
  editorInput: OpenInputOptions['editorInput'],
  uri: string,
  error: unknown,
): Promise<void> => {
  const latestState = context.getState()
  if (editorInput.type === 'editor' && error instanceof Error && error.name === 'BinaryFileError') {
    const editorUid = findTabById(latestState, tabId)?.tab.editorUid ?? -1
    const binaryState = updateTab(latestState, tabId, {
      editorInput: { type: 'binary', uri },
      editorUid: -1,
      errorMessage: undefined,
      loadingState: 'binary',
    })
    await context.updateState(() => binaryState)
    if (editorUid !== -1) {
      await disposeEditors([editorUid])
    }
    return
  }
  const errorMessage = error instanceof Error ? error.message : 'Failed to open URI'
  const errorState = updateTab(latestState, tabId, {
    errorMessage,
    loadingState: 'error',
  })
  await context.updateState(() => errorState)
}

const findReusableTab = (state: MainAreaState, options: OpenInputOptions, uri: string): ReturnType<typeof findTabByUri> => {
  return options.reuseExisting === false ? undefined : findTabByUri(state, uri)
}

const getStateWithIcon = (state: MainAreaState, tabId: number, uri: string, icon: string): MainAreaState => {
  const stateWithIcon = updateTab(state, tabId, { icon })
  return {
    ...stateWithIcon,
    fileIconCache: icon && !PathDisplay.getFileIcon(uri) ? { ...stateWithIcon.fileIconCache, [uri]: icon } : stateWithIcon.fileIconCache,
  }
}

const disposePreviewEditor = async (editorUid: number): Promise<void> => {
  if (editorUid !== -1) {
    await disposeEditors([editorUid])
  }
}

const isSupersededPreview = (state: MainAreaState, initialState: MainAreaState, requestId: number, preview: boolean): boolean => {
  return preview && (state.openRequestId !== requestId || getActiveTabId(state) !== getActiveTabId(initialState))
}

export const openInputWithContext = async (context: AsyncCommandContext<MainAreaState>, options: OpenInputOptions): Promise<void> => {
  Assert.object(context.getState())
  Assert.object(options)
  const requestId = getNextRequestId()
  await context.updateState((state) => ({ ...state, openRequestId: requestId }))
  const state = context.getState()

  const { editorInput } = options
  const preview = options.preview ?? false
  const uri = getEditorInputUri(editorInput)
  const title = getEditorInputTitle(editorInput)
  let currentState = state
  let existingTab = findReusableTab(currentState, options, uri)
  let shouldRetry = shouldRetryExistingTab(existingTab, editorInput, options.forceOpen === true)
  let icon = ''
  let { iconThemeVersion } = state
  if (!existingTab || shouldRetry) {
    const {
      icon: resolvedIcon,
      state: { iconThemeVersion: resolvedIconThemeVersion },
    } = await prepareTabIcon(context, uri)
    icon = resolvedIcon
    iconThemeVersion = resolvedIconThemeVersion
    currentState = context.getState()
    existingTab = findReusableTab(currentState, options, uri)
    shouldRetry = shouldRetryExistingTab(existingTab, editorInput, options.forceOpen === true)
  }
  if (isSupersededPreview(currentState, state, requestId, preview)) {
    return
  }
  if (currentState.iconThemeVersion !== iconThemeVersion) {
    return openInputWithContext(context, options)
  }
  if (existingTab && !shouldRetry) {
    const switchedState = getExistingTabState(currentState, existingTab, preview)
    await context.updateState(() => switchedState)
    await applyInitialCursorPosition(switchedState, existingTab.tab.id, options.initialCursorPosition)
    await focusIfRequested(context.getState(), options.focus)
    return
  }
  const replacedEditorUid = existingTab ? -1 : getActivePreviewEditorUid(currentState)
  const previousTabId = getActiveTabId(currentState)
  const stateForOpen = existingTab ? getExistingTabState(currentState, existingTab, preview) : currentState
  const { stateWithTab, tabId } = getStateWithTab(stateForOpen, editorInput, existingTab, shouldRetry, uri, preview, title)

  await context.updateState(() => getStateWithIcon(stateWithTab, tabId, uri, icon))
  await disposePreviewEditor(replacedEditorUid)

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

  const [fileSize, viewletModuleId] = await Promise.all([
    getLargeFileSize(editorInput, options.forceOpen === true, state.applicationId),
    getViewletModuleIdForEditorInput(editorInput, state.applicationId),
  ])
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

    const { newState: switchedState } = await ViewletLifecycle.switchViewlet(intermediateState, previousTabId, tabId, false)
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

    const args = getViewletArgs(options)
    await createViewletContent(viewletModuleId, editorUid, tabId, bounds, uri, args, state.applicationId)

    const latestState = context.getState()
    let readyState = ViewletLifecycle.handleViewletReady(latestState, editorUid)

    await context.updateState(() => readyState)
    // Focus commits the selected editor before targeting its DOM. Reuse that
    // commit when no cursor command needs the editor attached beforehand.
    const renderWithFocus =
      options.focus && RendererProcess.isConnected() && !options.initialCursorPosition && getActiveTabId(context.getState()) === tabId
    if (!renderWithFocus) {
      await renderMainAreaPending(state.uid, state.applicationId)
      await applyInitialCursorPosition(context.getState(), tabId, options.initialCursorPosition)
    }
    await focusIfRequested(context.getState(), options.focus)

    const renderedTitle = await getViewletTitle(editorUid)
    if (renderedTitle) {
      readyState = ViewletLifecycle.handleViewletReady(context.getState(), editorUid, renderedTitle)
      await context.updateState(() => readyState)
    }
    // Earlier visibility commands can run before the final editor DOM is committed.
    // Request a final scroll without changing the tab DOM or fetching its icon again.
    await context.updateState((state) => ({
      ...state,
      activeTabVisibilityVersion: (state.activeTabVisibilityVersion ?? 0) + 1,
    }))
    // Creation renders a detached editor. Start optional providers only once
    // the ready editor is attached and its selection and focus are restored.
    void runLoadContentLater(editorUid)
  } catch (error) {
    await handleOpenError(context, tabId, editorInput, uri, error)
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
