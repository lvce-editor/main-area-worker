import { set } from '../MainAreaStates/MainAreaStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number, platform: number, assetDir: string): void => {
  const state: any = {
    assetDir,
    platform,
    statusBarItemsLeft: [],
    statusBarItemsRight: [],
    uid,
  }
  set(uid, state, state)
}
