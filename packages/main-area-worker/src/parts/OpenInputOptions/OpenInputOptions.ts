import type { EditorInput } from '../EditorInput/EditorInput.ts'

export interface OpenInputOptions {
  readonly editorInput: EditorInput
  readonly focu: boolean
  readonly preview?: boolean
}
