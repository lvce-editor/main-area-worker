import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const focus = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTab = getActiveTab(state)
  const editorUid = activeTab?.tab.editorUid
  if (typeof editorUid !== 'number' || editorUid < 0) {
    return state
  }
  if (RendererProcess.isConnected()) {
    await RendererProcess.invoke('Viewlet.focusSelectorAfterRender', editorUid, '[name="editor"]')
  } else {
    await RendererWorker.invoke('Viewlet.focusSelector', editorUid, '[name="editor"]')
  }
  return state
}
