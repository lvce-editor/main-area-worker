import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../Tab/Tab.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { createViewletContent, getViewletTitle } from '../CreateViewlet/CreateViewlet.ts'
import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { loadHomeDirUri } from '../LoadHomeDirUri/LoadHomeDirUri.ts'
import { get } from '../MainAreaStates/MainAreaStates.ts'
import { notifyActiveEditorChange } from '../NotifyActiveEditorChange/NotifyActiveEditorChange.ts'
import { notifyMountedViewlets } from '../NotifyMountedViewlets/NotifyMountedViewlets.ts'
import { getSelectedTabBounds } from '../SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import { updateTabUriTitles } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'
import { handleViewletReady } from '../ViewletLifecycle/ViewletLifecycle.ts'
import { loadFileIcons } from './LoadFileIcons.ts'

const isCurrent = (context: AsyncCommandContext<MainAreaState>): boolean => {
  const state = context.getState()
  return !state.disposed && get(state.uid)?.newState === state
}

const renderPending = async (context: AsyncCommandContext<MainAreaState>): Promise<void> => {
  if (!isCurrent(context)) {
    return
  }
  const { applicationId, uid } = context.getState()
  await ApplicationRpc.invoke(applicationId, 'Layout.renderMainAreaPending', uid)
}

const loadRestoredTab = async (context: AsyncCommandContext<MainAreaState>, tab: Tab): Promise<void> => {
  const isPending = (): boolean => {
    const latestTab = findTabById(context.getState(), tab.id)?.tab
    return isCurrent(context) && latestTab?.editorUid === tab.editorUid && latestTab.loadingState === 'loading'
  }
  try {
    const state = context.getState()
    const moduleId = await getViewletModuleIdForEditorInput(tab.editorInput!, state.applicationId)
    if (!isPending()) {
      return
    }
    if (!moduleId) {
      throw new Error('Could not determine editor type for this URI')
    }
    const latestState = context.getState()
    const location = findTabById(latestState, tab.id)!
    const bounds = getSelectedTabBounds(latestState, location.groupId)
    await createViewletContent(moduleId, tab.editorUid, tab.id, bounds, tab.uri || '', [{ focus: false }], state.applicationId)
    if (!isPending()) {
      await disposeEditors([tab.editorUid])
      return
    }
    const beforeReady = context.getState()
    const readyState = await context.updateState((current) => handleViewletReady(current, tab.editorUid))
    await notifyActiveEditorChange(beforeReady, readyState)
    await notifyMountedViewlets(beforeReady, readyState)
    await renderPending(context)
    // Optional metadata must never hold up editor readiness or another group.
    const title = await getViewletTitle(tab.editorUid)
    if (!isCurrent(context) || findTabById(context.getState(), tab.id)?.tab.editorUid !== tab.editorUid) {
      return
    }
    if (title) {
      await context.updateState((current) => handleViewletReady(current, tab.editorUid, title))
    }
    await renderPending(context)
  } catch (error) {
    if (!isPending()) {
      return
    }
    await disposeEditors([tab.editorUid])
    await context.updateState((current) =>
      updateTab(current, tab.id, {
        editorUid: -1,
        errorMessage: error instanceof Error ? error.message : 'Failed to restore editor',
        loadingState: 'error',
      }),
    )
    await renderPending(context)
  }
}

const loadHomeDir = async (context: AsyncCommandContext<MainAreaState>): Promise<void> => {
  const homeDirUri = await loadHomeDirUri(context.getState().applicationId)
  if (!isCurrent(context)) {
    return
  }
  await context.updateState((state) => updateTabUriTitles({ ...state, homeDirUri }))
  await renderPending(context)
}

const loadIcons = async (context: AsyncCommandContext<MainAreaState>): Promise<void> => {
  const { fileIconCache, updatedLayout } = await loadFileIcons(context.getState())
  if (!isCurrent(context)) {
    return
  }
  const icons = new Map<number, Tab>(
    updatedLayout.groups.flatMap((group: MainAreaState['layout']['groups'][number]) => group.tabs.map((tab) => [tab.id, tab] as const)),
  )
  // Metadata completion must not restore an obsolete layout or tab selection.
  await context.updateState((state) => ({
    ...state,
    fileIconCache: { ...state.fileIconCache, ...fileIconCache },
    layout: {
      ...state.layout,
      groups: state.layout.groups.map((group) => ({
        ...group,
        tabs: group.tabs.map((tab) => {
          const restored = icons.get(tab.id)
          return restored && restored.uri === tab.uri ? { ...tab, icon: restored.icon } : tab
        }),
      })),
    },
  }))
  await renderPending(context)
}

export const loadContentLater = async (context: AsyncCommandContext<MainAreaState>): Promise<void> => {
  const state = context.getState()
  const tabs = state.layout.groups.flatMap((group) => group.tabs.filter((tab) => tab.id === group.activeTabId && tab.loadingState === 'loading'))
  await Promise.all([loadHomeDir(context), loadIcons(context), ...tabs.map((tab) => loadRestoredTab(context, tab))])
}
