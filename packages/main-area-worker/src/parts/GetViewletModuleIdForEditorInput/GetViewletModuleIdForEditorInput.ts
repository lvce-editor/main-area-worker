import type { EditorInput } from '../EditorInput/EditorInput.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const getViewletModuleIdForEditorInput = async (editorInput: EditorInput): Promise<string | undefined> => {
  switch (editorInput.type) {
    case 'diff-editor':
      return ViewletModuleId.DiffEditor
    case 'editor':
    case 'image':
    case 'video':
      return getViewletModuleId(editorInput.uri)
    case 'extension-detail-view':
      return ViewletModuleId.ExtensionDetail
    case 'process-explorer':
      return ViewletModuleId.ProcessExplorer
  }
}
