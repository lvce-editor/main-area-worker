import type { EditorInput } from '../EditorInput/EditorInput.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const getViewletModuleIdForEditorInput = async (editorInput: EditorInput, applicationId?: string): Promise<string | undefined> => {
  switch (editorInput.type) {
    case 'binary':
      return undefined
    case 'diff-editor':
      return ViewletModuleId.DiffEditor
    case 'editor':
      return editorInput.forceText ? ViewletModuleId.EditorText : getViewletModuleId(editorInput.uri, undefined, applicationId)
    case 'extension-detail-view':
      return ViewletModuleId.ExtensionDetail
    case 'image':
    case 'video':
      return getViewletModuleId(editorInput.uri, undefined, applicationId)
    case 'process-explorer':
      return ViewletModuleId.ProcessExplorer
    case 'running-extensions':
      return ViewletModuleId.RunningExtensions
    case 'webview':
      return getViewletModuleId(editorInput.uri, editorInput.providerId, applicationId)
  }
}
