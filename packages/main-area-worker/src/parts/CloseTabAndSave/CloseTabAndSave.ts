import { RendererWorker } from '@lvce-editor/rpc-registry'
import { closeTab } from '../CloseTab/CloseTab.ts'
import { findTabInState } from '../FindTabInState/FindTabInState.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'

export const closeTabAndSave = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  const tab = findTabInState(state, groupId, tabId)
  if (!tab) {
    return state
  }

  if (tab.editorUid !== -1) {
    const editorState = await saveEditor(tab.editorUid)
    if (!editorState?.modified && tab.uri) {
      await RendererWorker.handleModifiedStatusChange(tab.uri, false)
    }
  }

  return closeTab(state, groupId, tabId)
}