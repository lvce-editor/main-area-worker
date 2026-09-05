import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { createViewlet } from '../CreateViewlet/CreateViewlet.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { getEditorInputEditorType } from '../GetEditorInputEditorType/GetEditorInputEditorType.ts'
import { getViewletModuleIdForEditorInput } from '../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { getSelectedTabBounds } from '../SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'
import * as ViewletLifecycle from '../ViewletLifecycle/ViewletLifecycle.ts'

interface ViewProvider {
  readonly elements?: readonly {
    readonly type: string
    readonly value: string
  }[]
  readonly id: string
  readonly name?: string
  readonly selector?: readonly string[]
  readonly title?: string
}

interface QuickPickEntry {
  readonly id: string
  readonly label: string
  readonly type: 'editor' | 'webview'
}

interface QuickPickItem {
  readonly description: string
  readonly label: string
  readonly value: QuickPickEntry
}

const textEditorEntry: QuickPickEntry = {
  id: 'editor',
  label: 'Text Editor',
  type: 'editor',
}

export const getViewProviderEntries = async (uri: string, applicationId?: string): Promise<readonly QuickPickEntry[]> => {
  try {
    const providers = (await ApplicationRpc.invoke(applicationId, 'WebView.getEditorProviders')) as readonly ViewProvider[]
    const matchingProviders = providers.filter((provider) => provider?.id && provider.selector?.some((selector) => uri.endsWith(selector)))
    return [
      textEditorEntry,
      ...matchingProviders.map((provider) => {
        const titleElement = provider.elements?.find((element) => element.type === 'title')
        return {
          id: provider.id,
          label: provider.name || provider.title || titleElement?.value || provider.id,
          type: 'webview' as const,
        }
      }),
    ]
  } catch {
    return [textEditorEntry]
  }
}

export const reopenEditorWith = async (context: AsyncCommandContext<MainAreaState>, preferredEditorId?: string): Promise<void> => {
  const initialState = context.getState()
  const { activeGroupId, groups } = initialState.layout
  const activeGroup = groups.find((group) => group.id === activeGroupId)
  const initialTab = activeGroup?.tabs.find((tab) => tab.id === activeGroup.activeTabId)
  if (!initialTab?.uri) {
    return
  }

  let selected: QuickPickEntry | undefined
  if (preferredEditorId === textEditorEntry.id) {
    selected = textEditorEntry
  } else {
    const entries = await getViewProviderEntries(initialTab.uri, initialState.applicationId)
    const items: readonly QuickPickItem[] = entries.map((entry) => ({
      description: '',
      label: entry.label,
      value: entry,
    }))
    selected = (await ApplicationRpc.invoke(initialState.applicationId, 'ExtensionHostQuickPick.showQuickPick', {
      items,
      placeholder: 'Select Editor',
    })) as QuickPickEntry | undefined
  }
  if (!selected) {
    return
  }

  const editorInput: EditorInput =
    selected.type === 'editor'
      ? {
          forceText: true,
          type: 'editor',
          uri: initialTab.uri,
        }
      : {
          providerId: selected.id,
          type: 'webview',
          uri: initialTab.uri,
        }
  const viewletModuleId = await getViewletModuleIdForEditorInput(editorInput, context.getState().applicationId)
  if (!viewletModuleId) {
    return
  }

  const latestState = context.getState()
  const latestTab = findTabById(latestState, initialTab.id)
  if (!latestTab) {
    return
  }

  const oldEditorUid = latestTab.tab.editorUid
  const resetState = updateTab(latestState, initialTab.id, {
    editorInput,
    editorType: getEditorInputEditorType(editorInput),
    editorUid: -1,
    errorMessage: undefined,
    loadingState: undefined,
  })
  const bounds = getSelectedTabBounds(resetState, latestTab.groupId)
  const stateWithViewlet = ViewletLifecycle.createViewletForTab(resetState, initialTab.id, viewletModuleId, bounds)
  await context.updateState(() => stateWithViewlet)

  const tabWithViewlet = findTabById(stateWithViewlet, initialTab.id)
  if (!tabWithViewlet || tabWithViewlet.tab.editorUid === -1) {
    return
  }

  const renderedTitle = await createViewlet(
    viewletModuleId,
    tabWithViewlet.tab.editorUid,
    initialTab.id,
    bounds,
    initialTab.uri,
    undefined,
    latestState.applicationId,
  )
  const readyState = ViewletLifecycle.handleViewletReady(context.getState(), tabWithViewlet.tab.editorUid, renderedTitle)
  await context.updateState(() => readyState)
  if (oldEditorUid !== -1) {
    try {
      await RendererWorker.invoke('Viewlet.dispose', oldEditorUid)
    } catch {
      // Reopening should still proceed if the previous viewlet was already disposed.
    }
  }
}
