import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import { createEmptyGroup } from '../CreateEmptyGroup/CreateEmptyGroup.ts'
import * as GetNextRequestId from '../GetNextRequestId/GetNextRequestId.ts'
import * as Id from '../Id/Id.ts'
import { openTab } from '../OpenTab/OpenTab.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { getUriTitle } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'

export const ensureActiveGroup = (
  state: MainAreaState,
  uri: string,
  preview: boolean = false,
  title: string = PathDisplay.getLabel(uri),
  editorInput?: EditorInput,
): MainAreaState => {
  const resolvedEditorInput: EditorInput = editorInput ?? { type: 'editor', uri }
  // Find the active group (by activeGroupId or focused flag)
  const { homeDirUri, layout } = state
  const { activeGroupId, groups } = layout
  const activeGroup = activeGroupId === -1 ? groups.find((group) => group.focused) : groups.find((group) => group.id === activeGroupId)

  // Generate a request ID for content loading
  const requestId = GetNextRequestId.getNextRequestId()

  // If no active group exists, create one
  let newState: MainAreaState
  if (activeGroup) {
    const activeTab = activeGroup.tabs.find((tab) => tab.id === activeGroup.activeTabId)
    if (activeTab?.isPreview) {
      const tabId = Id.create()
      const updatedGroups = groups.map((group) => {
        if (group.id !== activeGroup.id) {
          return group
        }
        const updatedTabs: readonly Tab[] = group.tabs.map((tab): Tab => {
          if (tab.id !== activeTab.id) {
            return tab
          }
          return {
            ...tab,
            editorInput: resolvedEditorInput,
            editorUid: Id.create(),
            errorMessage: '',
            icon: '',
            id: tabId,
            isDirty: false,
            isPreview: preview,
            language: '',
            loadingState: 'loading',
            title,
            uri,
            uriTitle: getUriTitle(uri, homeDirUri || ''),
          }
        })
        return {
          ...group,
          activeTabId: tabId,
          tabs: updatedTabs,
        }
      })
      return {
        ...state,
        layout: {
          ...layout,
          activeGroupId: activeGroup.id,
          groups: updatedGroups,
        },
      }
    }

    // Create a new tab with the URI in the active group
    const tabId = Id.create()
    const editorUid = Id.create()
    const newTab: Tab = {
      editorInput: resolvedEditorInput,
      editorUid,
      errorMessage: '',
      icon: '',
      id: tabId,
      isDirty: false,
      isPreview: preview,
      language: '',
      loadingState: 'loading',
      title,
      uri: uri,
      uriTitle: getUriTitle(uri, homeDirUri || ''),
    }
    newState = openTab(state, activeGroup.id, newTab)
  } else {
    newState = createEmptyGroup(state, uri, requestId, preview, title, resolvedEditorInput)
  }

  return newState
}
