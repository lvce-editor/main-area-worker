import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const focus = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTab = getActiveTab(state)
  const editorUid = activeTab?.tab.editorUid
  if (typeof editorUid !== 'number' || editorUid < 0) {
    return state
  }
  const editorSelector = activeTab?.tab.terminal ? '.xterm-helper-textarea' : '[name="editor"]'
  const selector = activeTab?.tab.uri?.startsWith('search-editor://') ? '[name="SearchValue"]' : editorSelector
  if (RendererProcess.isConnected()) {
    await ApplicationRpc.invoke(state.applicationId, 'Layout.renderMainAreaPending', state.uid)
    await RendererProcess.invoke('Viewlet.focusSelector', editorUid, selector)
    await RendererProcess.invoke('Viewlet.focusSelectorAfterRender', editorUid, selector)
  } else {
    await RendererWorker.invoke('Viewlet.focusSelector', editorUid, selector)
  }
  return state
}
