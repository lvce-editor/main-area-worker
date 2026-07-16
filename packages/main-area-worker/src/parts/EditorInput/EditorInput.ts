interface BaseEditorInput {
  readonly type: string
}

interface EditorEditorInput extends BaseEditorInput {
  readonly forceText?: boolean
  readonly type: 'editor'
  readonly uri: string
}

interface ImageEditorInput extends BaseEditorInput {
  readonly type: 'image'
  readonly uri: string
}

interface VideoEditorInput extends BaseEditorInput {
  readonly type: 'video'
  readonly uri: string
}

interface WebViewEditorInput extends BaseEditorInput {
  readonly providerId: string
  readonly type: 'webview'
  readonly uri: string
}

interface DiffEditorInput extends BaseEditorInput {
  readonly type: 'diff-editor'
  readonly uriLeft: string
  readonly uriRight: string
}

interface ExtensionDetailViewInput extends BaseEditorInput {
  readonly extensionId: string
  readonly type: 'extension-detail-view'
}

interface ProcessExplorerEditorInput extends BaseEditorInput {
  readonly type: 'process-explorer'
}

interface RunningExtensionsEditorInput extends BaseEditorInput {
  readonly type: 'running-extensions'
}

export type EditorInput =
  | EditorEditorInput
  | ImageEditorInput
  | VideoEditorInput
  | DiffEditorInput
  | ExtensionDetailViewInput
  | ProcessExplorerEditorInput
  | RunningExtensionsEditorInput
  | WebViewEditorInput
