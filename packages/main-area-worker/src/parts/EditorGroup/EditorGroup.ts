import type { LayoutDirection } from '../LayoutDirection/LayoutDirection.ts'
import type { Tab } from '../Tab/Tab.ts'

export interface EditorGroup {
  readonly activeTabId: number
  readonly direction: LayoutDirection
  readonly id: number
  readonly isEmpty: boolean
  readonly isFocused: boolean
  readonly paintHold?: { readonly tab: Tab; readonly token: object }
  readonly segmentId?: number
  readonly size: number
  readonly tabs: readonly Tab[]
}
