import type { Tab } from '../Tab/Tab.ts'
import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'

export interface EditorGroup {
  readonly activeTabId: number | undefined
  readonly direction?: LayoutDirection
  readonly focused: boolean
  readonly id: number
  readonly isEmpty: boolean
  readonly size: number
  readonly tabs: readonly Tab[]
}
