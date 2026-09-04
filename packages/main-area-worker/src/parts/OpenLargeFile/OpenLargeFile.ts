import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { openInput } from '../OpenInput/OpenInput.ts'

export const openLargeFile = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTabData = getActiveTab(state)
  const editorInput = activeTabData?.tab.editorInput
  if (!activeTabData || editorInput?.type !== 'editor') {
    return state
  }
  return openInput(state, {
    editorInput,
    focus: false,
    forceOpen: true,
    preview: activeTabData.tab.isPreview,
  })
}
