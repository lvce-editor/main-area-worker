import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'
import { findTabInState } from '../FindTabInState/FindTabInState.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'

export const closeTabAndSave = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  const tab = findTabInState(state, groupId, tabId)
  if (!tab) {
    return state
  }

  if (tab.editorUid !== -1 && tab.isDirty) {
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
