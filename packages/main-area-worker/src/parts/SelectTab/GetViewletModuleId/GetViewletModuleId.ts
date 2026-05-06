import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { Tab } from '../../MainAreaState/MainAreaState.ts'
import { getViewletModuleIdForEditorInput } from '../../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { normalizeTabEditorInput } from '../../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

export const getViewletModuleId = async (tab: Tab): Promise<string | undefined> => {
  const normalizedTab = normalizeTabEditorInput(tab)
  return normalizedTab.editorInput
    ? getViewletModuleIdForEditorInput(normalizedTab.editorInput)
    : RendererWorker.invoke('Layout.getModuleId', normalizedTab.uri)
}
