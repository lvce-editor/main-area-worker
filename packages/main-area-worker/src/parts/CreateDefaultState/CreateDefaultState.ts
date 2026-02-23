import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const createDefaultState = (): MainAreaState => {
  return {
    assetDir: '',
    fileIconCache: {},
    height: 0,
    iframes: [],
    initial: false,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
    maxOpenEditorGroups: Number.POSITIVE_INFINITY,
    maxOpenEditors: Number.POSITIVE_INFINITY,
    platform: 0,
    splitButtonEnabled: false,
    tabHeight: 35,
    uid: 0,
    width: 0,
    workspaceuri: '',
    x: 0,
    y: 0,
  }
}
