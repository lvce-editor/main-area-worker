import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const createDefaultState = (): MainAreaState => {
  return {
    assetDir: '',
    layout: {
      activeGroupId: '0',
      direction: 'horizontal',
      groups: [],
    },
    platform: 0,
    uid: 0,
  }
}
