import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../Tab/Tab.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'
import { findTabInState } from '../FindTabInState/FindTabInState.ts'
import { saveEditor } from '../SaveEditor/SaveEditor.ts'

type SavePromptResult = 'cancel' | 'discard' | 'save'

const promptSave = async (title: string): Promise<SavePromptResult> => {
  const message = `Do you want to save the changes you made to ${title}?`
  const options = {
    cancelMessage: 'Cancel',
    confirmMessage: 'Save',
    discardMessage: "Don't Save",
    discardPrompt: `Discard the changes you made to ${title}?`,
    title: 'Save Changes',
  }
  try {
    return await RendererWorker.invoke('ConfirmPrompt.prompt3', message, options)
  } catch (error) {
    const errorMessage = String(error)
    if (!errorMessage.includes('ConfirmPrompt.prompt3') || !errorMessage.includes('not found')) {
      throw error
    }
    return DialogWorker.invoke('ConfirmPrompt.prompt3', message, options)
  }
}

export const canCloseTab = async (tab: Tab): Promise<boolean> => {
  if (tab.editorUid === -1 || !tab.isDirty) {
    return true
  }
  const savePromptResult = await promptSave(tab.title)
  if (savePromptResult === 'cancel') {
    return false
  }
  if (savePromptResult === 'save') {
    const editorState = await saveEditor(tab.editorUid)
    if (editorState?.modified !== false) {
      return false
    }
    if (tab.uri) {
      await RendererWorker.handleModifiedStatusChange(tab.uri, false)
    }
  }
  return savePromptResult === 'save' || savePromptResult === 'discard'
}

export const closeTabAndSave = async (state: MainAreaState, groupId: number, tabId: number): Promise<MainAreaState> => {
  const tab = findTabInState(state, groupId, tabId)
  if (!tab) {
    return state
  }

  if (!(await canCloseTab(tab))) {
    return state
  }

  return closeTabWithViewlet(state, groupId, tabId)
}
