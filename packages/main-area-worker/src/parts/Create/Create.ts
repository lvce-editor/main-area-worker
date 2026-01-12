import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { set } from '../StatusBarStates/StatusBarStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number, platform: number, assetDir: string): void => {
  const state: StatusBarState = {
    assetDir,
    platform,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  set(uid, state, state)
}
