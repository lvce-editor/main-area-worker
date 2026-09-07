import type { CursorPosition } from '../CursorPosition/CursorPosition.ts'

export interface OpenUriOptions {
  readonly focus?: boolean
  readonly initialCursorPosition?: CursorPosition
  readonly preview?: boolean
  readonly reuseExisting?: boolean
  readonly shouldFocus?: boolean
  readonly uri: string
}
