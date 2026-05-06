import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { Tab } from '../../MainAreaState/MainAreaState.ts'
import { getViewletModuleIdForEditorInput } from '../../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'

export const getViewletModuleId = async (tab: Tab): Promise<string | undefined> => {
  return tab.editorInput ? getViewletModuleIdForEditorInput(tab.editorInput) : RendererWorker.invoke('Layout.getModuleId', tab.uri)
}
