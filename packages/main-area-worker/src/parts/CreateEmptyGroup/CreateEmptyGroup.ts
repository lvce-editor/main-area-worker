import type { EditorGroup, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const createEmptyGroup = (state: MainAreaState, uri: string, requestId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const groupId = Id.create()
  const title = PathDisplay.getLabel(uri)
  const tabId = Id.create()
  const newTab = {
    content: '',
    editorType: 'text' as const,
    editorUid: -1,
    errorMessage: '',
    id: tabId,
    isDirty: false,
    language: '',
    loadingState: 'loading' as const,
    title,
    uri,
  }
  const newGroup: EditorGroup = {
    activeTabId: newTab.id,
    focused: true,
    id: groupId,
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
