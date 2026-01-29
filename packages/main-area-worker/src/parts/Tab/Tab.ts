import type { EditorType } from '../EditorType/EditorType.ts'
import type { LoadingState } from '../LoadingState/LoadingState.ts'

export interface Tab {
  readonly content: string
  readonly customEditorId?: string
  readonly editorType: EditorType
  readonly editorUid: number
  readonly errorMessage?: string
  readonly icon: string
  readonly id: number
  readonly isAttached?: boolean
  readonly isDirty: boolean
  readonly language?: string
  readonly loadingState?: LoadingState
  readonly loadRequestId?: number
  readonly title: string
  readonly uri?: string
  readonly viewletInstanceId?: number
  readonly viewletRequestId?: number
}
