import type { Tab } from './Tab.ts'

export interface EditorGroup {
  readonly activeTabId: number | undefined
  readonly direction?: 'horizontal' | 'vertical'
  readonly focused: boolean
  readonly id: number
  readonly size: number
  readonly tabs: readonly Tab[]
}
