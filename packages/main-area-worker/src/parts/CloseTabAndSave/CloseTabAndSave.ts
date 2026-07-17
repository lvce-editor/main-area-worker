import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'
import { findTabInState } from '../FindTabInState/FindTabInState.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'

const promptSave = async (title: string): Promise<string> => {
  const shouldSave = await RendererWorker.confirm(`Do you want to save the changes you made to ${title}?`, {
    cancelMessage: 'More Options',
    confirmMessage: 'Save',
    title: 'Save Changes',
  })
  if (shouldSave) {
    return 'save'
  }
  const shouldDiscard = await RendererWorker.confirm(`Discard the changes you made to ${title}?`, {
    cancelMessage: 'Cancel',
    confirmMessage: "Don't Save",
    title: 'Save Changes',
  })
  return shouldDiscard ? 'discard' : 'cancel'
}

export const closeTabAndSave = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  const tab = findTabInState(state, groupId, tabId)
  if (!tab) {
    return state
  }

  if (tab.editorUid !== -1 && tab.isDirty) {
    const savePromptResult = await promptSave(tab.title)
    if (savePromptResult === 'cancel') {
      return state
    }
    if (savePromptResult === 'save') {
      const editorState = await saveEditor(tab.editorUid)
      if (editorState?.modified !== false) {
        return state
      }
      if (tab.uri) {
        await RendererWorker.handleModifiedStatusChange(tab.uri, false)
      }
    } else if (savePromptResult !== 'discard') {
      return state
    }
  }

  if (tab.uri?.startsWith('simple-browser://')) {
    return closeTabWithViewlet(state, groupId, tabId)
  }

  return closeTab(state, groupId, tabId)
}
