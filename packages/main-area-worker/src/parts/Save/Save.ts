import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export const save = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTabData = getActiveTab(state)
  if (!activeTabData) {
    return state
  }

  const { tab } = activeTabData
  if (tab.loadingState === 'loading') {
    return state
  }

  await RendererWorker.invoke('Editor.save', tab.editorUid)
  
  if (!tab.isDirty) {
    return state
  }
  
  return updateTab(state, tab.id, { isDirty: false })
}
