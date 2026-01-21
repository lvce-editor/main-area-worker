import type { EditorType } from './EditorType.ts'

export type LoadingState = 'idle' | 'loading' | 'loaded' | 'error'

export interface Tab {
  readonly content: string
  readonly customEditorId?: string
  readonly editorType: EditorType
  readonly errorMessage?: string
  readonly id: number
  readonly isDirty: boolean
  readonly language?: string
  readonly loadingState?: LoadingState
  readonly loadRequestId?: number
  readonly path?: string
  readonly title: string
}
