import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
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
    id: tabId,
    isDirty: false,
    loadingState: 'loading' as const,
    loadRequestId: requestId,
    path: uri,
    title,
  }
  const newGroup = {
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
