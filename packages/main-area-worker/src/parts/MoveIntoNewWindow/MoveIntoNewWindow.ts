import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTabAndSave } from '../CloseTabAndSave/CloseTabAndSave.ts'
import { findGroupById } from '../FindGroupById/FindGroupById.ts'

export const moveIntoNewWindow = async (state: MainAreaState): Promise<MainAreaState> => {
  const { activeGroupId } = state.layout
  const group = findGroupById(state, activeGroupId ?? 0)
  if (!group) {
    return state
  }
  const { activeTabId } = group
  if (activeTabId === undefined) {
    return state
  }
  const tab = group.tabs.find((tab) => tab.id === activeTabId)
  if (!tab?.uri) {
    return state
  }
  await RendererWorker.invoke('ElectronWindow.openNewWithUri', tab.uri)
  return closeTabAndSave(state, group.id, activeTabId)
}
