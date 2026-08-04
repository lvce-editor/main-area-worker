import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'

export interface MainAreaLayout {
  readonly activeGroupId: number
  readonly direction: LayoutDirection
  readonly groups: readonly EditorGroup[]
}
