import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { openInput } from '../OpenInput/OpenInput.ts'
import { openUri } from '../OpenUri/OpenUri.ts'

export const retryOpen = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTabData = getActiveTab(state)
  if (!activeTabData) {
    return state
  }
  const { tab } = activeTabData
  if (tab.editorInput) {
    return openInput(state, {
      editorInput: tab.editorInput,
      focu: false,
      preview: tab.isPreview,
    })
  }
  if (!tab.uri) {
    return state
  }
  return openUri(state, tab.uri)
}
