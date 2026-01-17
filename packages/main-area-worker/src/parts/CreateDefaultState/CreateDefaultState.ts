import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const createDefaultState = (): MainAreaState => {
  return {
    assetDir: '',
    platform: 0,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid: 0,
  }
}
