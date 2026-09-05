import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'
import { getUriTitle } from '../UpdateTabUriTitles/UpdateTabUriTitles.ts'

export const createEmptyGroup = (
  state: MainAreaState,
  uri: string,
  requestId: number,
  preview: boolean = false,
  title: string = PathDisplay.getLabel(uri),
  editorInput?: EditorInput,
): MainAreaState => {
  const resolvedEditorInput: EditorInput = editorInput ?? { type: 'editor', uri }
  const { homeDirUri, layout } = state
  const { direction, groups } = layout

  const groupId = Id.create()
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
    uri,
    uriTitle: getUriTitle(uri, homeDirUri || ''),
  }
  const newGroup: EditorGroup = {
    activeTabId: newTab.id,
    direction,
    focused: true,
    id: groupId,
    isEmpty: false,
    size: 100,
    tabs: [newTab],
  }

  return {
    ...state,
    layout: {
      ...layout,
      activeGroupId: groupId,
      groups: [...groups, newGroup],
    },
  }
}
