import type { CursorPosition } from '../CursorPosition/CursorPosition.ts'
import type { EditorInput } from '../EditorInput/EditorInput.ts'

export interface OpenInputOptions {
  readonly args?: readonly unknown[]
  readonly editorInput: EditorInput
  readonly focus: boolean
  readonly forceOpen?: boolean
  readonly initialCursorPosition?: CursorPosition
  readonly preview?: boolean
  readonly reuseExisting?: boolean
}
