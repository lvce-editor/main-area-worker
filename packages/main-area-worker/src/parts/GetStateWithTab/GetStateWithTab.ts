import type { EditorInput } from '../EditorInput/EditorInput.ts'
import type { EditorType } from '../EditorType/EditorType.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export const getStateWithTab = (
  currentState: MainAreaState,
  editorInput: EditorInput,
  existingTab: { tab: { id: number }; groupId: number } | undefined,
  shouldRetryExistingTab: boolean,
  uri: string,
  preview: boolean,
  title: string,
  editorType: EditorType,
): { stateWithTab: MainAreaState; tabId: number } => {
  if (shouldRetryExistingTab && existingTab) {
    const focusedState = focusEditorGroup(currentState, existingTab.groupId)
    return {
      stateWithTab: updateTab(focusedState, existingTab.tab.id, {
        editorInput,
        errorMessage: '',
        loadingState: 'loading',
        title,
        uri,
      }),
      tabId: existingTab.tab.id,
    }
  }

  const stateWithTab = ensureActiveGroup(currentState, uri, preview, title, editorType, editorInput)
  return {
    stateWithTab,
    tabId: getActiveTabId(stateWithTab)!,
  }
}
