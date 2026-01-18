import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const createDefaultState = (): MainAreaState => {
  return {
    assetDir: '',
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
}
