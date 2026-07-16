import type { EditorInput } from '../EditorInput/EditorInput.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const getViewletModuleIdForEditorInput = async (editorInput: EditorInput): Promise<string | undefined> => {
  switch (editorInput.type) {
    case 'diff-editor':
      return ViewletModuleId.DiffEditor
    case 'editor':
      return editorInput.forceText ? ViewletModuleId.EditorText : getViewletModuleId(editorInput.uri)
    case 'extension-detail-view':
      return ViewletModuleId.ExtensionDetail
    case 'image':
    case 'video':
      return getViewletModuleId(editorInput.uri)
    case 'process-explorer':
      return ViewletModuleId.ProcessExplorer
    case 'running-extensions':
      return ViewletModuleId.RunningExtensions
    case 'webview':
      return getViewletModuleId(editorInput.uri, editorInput.providerId)
  }
}
