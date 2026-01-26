import type { EditorType } from '../EditorType/EditorType.ts'
import type { LoadingState } from '../LoadingState/LoadingState.ts'
import type { ViewletState } from '../ViewletState/ViewletState.ts'

export interface Tab {
  readonly content: string
  readonly customEditorId?: string
  readonly editorType: EditorType
  readonly errorMessage?: string
  readonly id: number
  readonly isAttached?: boolean
  readonly isDirty: boolean
  readonly language?: string
  readonly loadingState?: LoadingState
  readonly loadRequestId?: number
  readonly path?: string
  readonly title: string
  readonly viewletInstanceId?: number
  readonly viewletRequestId?: number
  readonly viewletState?: ViewletState
}
