import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'

export const save = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTabData = getActiveTab(state)
  if (!activeTabData) {
    return state
  }

  const { tab } = activeTabData
  if (tab.loadingState !== 'loaded') {
    return state
  }

  await RendererWorker.invoke('Editor.save', tab.editorUid)
  return state
}
