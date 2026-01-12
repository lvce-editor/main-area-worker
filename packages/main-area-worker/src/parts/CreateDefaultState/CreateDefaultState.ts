import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'

export const createDefaultState = (): StatusBarState => {
  return {
    assetDir: '',
    platform: 0,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: 0,
  }
}
