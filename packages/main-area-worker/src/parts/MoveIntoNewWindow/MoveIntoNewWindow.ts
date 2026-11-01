import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { closeTabWithViewlet } from '../CloseTabWithViewlet/CloseTabWithViewlet.ts'
import { findGroupById } from '../FindGroupById/FindGroupById.ts'
import { normalizeTabEditorInput } from '../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

export const moveIntoNewWindow = async (state: MainAreaState): Promise<MainAreaState> => {
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
  if (!tab || tab.terminal) {
    return state
  }
  const editorInput = tab.editorInput ?? normalizeTabEditorInput(tab).editorInput
  if (!editorInput) {
    return state
  }
  await RendererWorker.invoke('ElectronWindow.openNewWithEditorInput', editorInput, tab.editorUid, tab.isDirty)
  return closeTabWithViewlet(state, group.id, activeTabId)
}
