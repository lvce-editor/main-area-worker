import type { EditorInput } from '../EditorInput/EditorInput.ts'
import { getViewletModuleId } from '../GetViewletModuleId/GetViewletModuleId.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const getViewletModuleIdForEditorInput = async (editorInput: EditorInput): Promise<string | undefined> => {
  switch (editorInput.type) {
    case 'editor':
      return getViewletModuleId(editorInput.uri)
    case 'diff-editor':
      return ViewletModuleId.DiffEditor
    case 'extension-detail-view':
      return ViewletModuleId.ExtensionDetail
  }
}