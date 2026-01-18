import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const createDefaultMainAreaState = (): MainAreaState => {
  return {
    assetDir: '',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
    platform: 0,
    uid: 0,
  }
}
