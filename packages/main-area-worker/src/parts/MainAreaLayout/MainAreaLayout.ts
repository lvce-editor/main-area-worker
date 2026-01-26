import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'

export interface MainAreaLayout {
  readonly activeGroupId: number | undefined
  readonly direction: 'horizontal' | 'vertical'
  readonly groups: readonly EditorGroup[]
}
