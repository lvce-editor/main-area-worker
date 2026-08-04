import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { findGroupById } from '../FindGroupById/FindGroupById.ts'

export const copyIntoNewWindow = async (state: MainAreaState): Promise<MainAreaState> => {
  const { layout } = state
  const { activeGroupId } = layout
  const group = findGroupById(state, activeGroupId)
  if (!group) {
    return state
  }
  const { activeTabId } = group
  if (activeTabId === -1) {
    return state
  }
  const tab = group.tabs.find((tab) => tab.id === activeTabId)
  if (!tab?.uri) {
    return state
  }
  await RendererWorker.invoke('ElectronWindow.openNewWithUri', tab.uri)
  return state
}
