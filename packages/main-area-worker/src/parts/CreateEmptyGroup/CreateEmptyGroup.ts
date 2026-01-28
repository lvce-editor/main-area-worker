import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const createEmptyGroup = (state: MainAreaState, uri: string, requestId: number): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const groupId = Id.create()
  const title = PathDisplay.getLabel(uri)
  const tabId = Id.create()
  const editorUid = Id.create()
  const newTab: Tab = {
    content: '',
    editorType: 'text',
    editorUid,
    errorMessage: '',
    id: tabId,
    isDirty: false,
    language: '',
    loadingState: 'loading',
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
