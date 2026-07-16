import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'
import { findTabInState } from '../FindTabInState/FindTabInState.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'

const hasUnsavedUntitledContent = async (editorUid: number, uri: string | undefined): Promise<boolean> => {
  if (!uri?.startsWith('untitled:')) {
    return false
  }
  try {
    const content = await RendererWorker.invoke('Editor.getText', editorUid)
    return typeof content === 'string' && content.length > 0
  } catch {
    return true
  }
}

export const closeTabAndSave = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  const tab = findTabInState(state, groupId, tabId)
  if (!tab) {
    return state
  }

  const shouldSave = tab.editorUid !== -1 && (tab.isDirty || (await hasUnsavedUntitledContent(tab.editorUid, tab.uri)))
  if (shouldSave) {
    const editorState = await saveEditor(tab.editorUid)
    if (editorState?.modified !== false) {
      return state
    }
    if (tab.uri) {
      await RendererWorker.handleModifiedStatusChange(tab.uri, false)
    }
  }

  if (tab.uri?.startsWith('simple-browser://')) {
    return closeTabWithViewlet(state, groupId, tabId)
  }

  return closeTab(state, groupId, tabId)
}
