import type { EditorType } from './EditorType.ts'

export interface Tab {
  readonly content: string
  readonly customEditorId?: string
  readonly editorType: EditorType
  readonly id: number
  readonly isDirty: boolean
  readonly language?: string
  readonly path?: string
  readonly title: string
}
