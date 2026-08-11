import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { openInput } from '../OpenInput/OpenInput.ts'

export const openBinaryAsText = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTabData = getActiveTab(state)
  const editorInput = activeTabData?.tab.editorInput
  if (!activeTabData || editorInput?.type !== 'binary') {
    return state
  }
  const { tab } = activeTabData
  return openInput(state, {
    editorInput: {
      forceText: true,
      type: 'editor',
      uri: editorInput.uri,
    },
    focus: false,
    preview: tab.isPreview,
  })
}
