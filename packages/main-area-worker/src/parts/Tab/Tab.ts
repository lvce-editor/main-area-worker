import type { EditorType } from '../EditorType/EditorType.ts'
import type { LoadingState } from '../LoadingState/LoadingState.ts'

export interface Tab {
  readonly editorType: EditorType
  readonly editorUid: number
  readonly errorMessage?: string
  readonly icon: string
  readonly id: number
  readonly isDirty: boolean
  readonly isPreview: boolean
  readonly language?: string
  readonly loadingState?: LoadingState
  readonly title: string
  readonly uri?: string
}
