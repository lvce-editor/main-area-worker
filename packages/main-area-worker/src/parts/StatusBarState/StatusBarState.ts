import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface StatusBarState {
  readonly assetDir: string
  readonly disposed?: boolean
  readonly platform: number
  readonly statusBarItemsLeft: readonly StatusBarItem[]
  readonly statusBarItemsRight: readonly StatusBarItem[]
  readonly uid: number
}
