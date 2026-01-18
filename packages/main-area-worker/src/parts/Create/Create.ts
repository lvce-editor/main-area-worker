import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { set } from '../MainAreaStates/MainAreaStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number, platform: number, assetDir: string): void => {
  const state: MainAreaState = {
    assetDir,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
    platform,
    uid,
  }
  set(uid, state, state)
}
