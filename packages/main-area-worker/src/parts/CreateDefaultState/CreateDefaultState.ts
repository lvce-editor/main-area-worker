import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const createDefaultState = (): MainAreaState => {
  return {
    assetDir: '',
    fileIconCache: {},
    height: 0,
    iframes: [],
    initial:false,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    splitButtonEnabled: false,
    tabHeight: 35,
    uid: 0,
    width: 0,
    x: 0,
    y: 0
  }
}
