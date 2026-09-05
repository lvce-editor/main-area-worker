import type { Tab } from '../../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../../ApplicationRpc/ApplicationRpc.ts'
import { getViewletModuleIdForEditorInput } from '../../GetViewletModuleIdForEditorInput/GetViewletModuleIdForEditorInput.ts'
import { normalizeTabEditorInput } from '../../NormalizeTabEditorInput/NormalizeTabEditorInput.ts'

export const getViewletModuleId = async (tab: Tab, applicationId?: string): Promise<string | undefined> => {
  const normalizedTab = normalizeTabEditorInput(tab)
  return normalizedTab.editorInput
    ? getViewletModuleIdForEditorInput(normalizedTab.editorInput, applicationId)
    : ApplicationRpc.invoke(applicationId, 'Layout.getModuleId', normalizedTab.uri)
}
