import type { EditorInput } from '../EditorInput/EditorInput.ts'

export interface OpenInputOptions {
  readonly args?: readonly unknown[]
  readonly editorInput: EditorInput
  readonly focus: boolean
  readonly preview?: boolean
}
