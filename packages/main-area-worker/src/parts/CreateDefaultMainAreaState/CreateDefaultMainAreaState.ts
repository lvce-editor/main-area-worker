import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const createDefaultMainAreaState = (): MainAreaState => {
  return {
    assetDir: '',
    layout: {
      activeGroupId: 'group-1',
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: true,
          id: 'group-1',
          size: 100,
          tabs: [],
        },
      ],
    },
    platform: 0,
    uid: 0,
  }
}
