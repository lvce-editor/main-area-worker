import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getActiveTab } from '../GetActiveTab/GetActiveTab.ts'

export const focus = async (state: MainAreaState): Promise<MainAreaState> => {
  const activeTab = getActiveTab(state)
  const editorUid = activeTab?.tab.editorUid
  if (typeof editorUid !== 'number' || editorUid < 0) {
    return state
  }
  await RendererWorker.invoke('Viewlet.focusSelector', editorUid, '[name="editor"]')
  return state
}
