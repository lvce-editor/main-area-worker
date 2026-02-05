import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'

export const handleClickTogglePreview = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTabInfo = getActiveTab(state)
  if (!activeTabInfo || !activeTabInfo.tab.uri) {
    return state
  }

  await RendererWorker.invoke('Layout.showPreview', activeTabInfo.tab.uri)
  return state
}
