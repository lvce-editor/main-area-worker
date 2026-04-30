import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { EditorType } from '../EditorType/EditorType.ts'
import type { EditorGroup, MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import * as PathDisplay from '../PathDisplay/PathDisplay.ts'

export const createEmptyGroup = (
  state: MainAreaState,
  uri: string,
  requestId: number,
  preview: boolean = false,
  title: string = PathDisplay.getLabel(uri),
  editorType: EditorType = 'text',
  editorInput?: EditorInput,
): MainAreaState => {
  const { layout } = state
  const { groups } = layout

  const groupId = Id.create()
  const tabId = Id.create()
  const editorUid = Id.create()
  const newTab: Tab = {
    editorInput,
    editorType,
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
  }
  const newGroup: EditorGroup = {
    activeTabId: newTab.id,
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
