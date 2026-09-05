import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'

export const handleClickTogglePreview = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTabInfo = getActiveTab(state)
  if (!activeTabInfo || !activeTabInfo.tab.uri) {
    return state
  }

  await ApplicationRpc.invoke(state.applicationId, 'Layout.showPreview', activeTabInfo.tab.uri)
  return state
}
