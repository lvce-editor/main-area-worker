import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { set } from '../MainAreaStates/MainAreaStates.ts'

export const create = (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  platform: number,
  assetDir: string,
  tabHeight: number = 35,
): void => {
  const state: MainAreaState = {
    assetDir,
    fileIconCache: {},
    height,
    iframes: [],
    initial:true,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
    platform,
    splitButtonEnabled: false,
    tabHeight,
    uid,
    width,
    x,
    y
  }
  set(uid, state, state)
}
