export interface BaseEditorInput {
  readonly type: string
}

export interface EditorEditorInput extends BaseEditorInput {
  readonly type: 'editor'
  readonly uri: string
}

export interface DiffEditorInput extends BaseEditorInput {
  readonly type: 'diff-editor'
  readonly uriLeft: string
  readonly uriRight: string
}

export interface ExtensionDetailViewInput extends BaseEditorInput {
  readonly extensionId: string
  readonly type: 'extension-detail-view'
}

export type EditorInput = EditorEditorInput | DiffEditorInput | ExtensionDetailViewInput