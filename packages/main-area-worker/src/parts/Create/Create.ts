import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as LayoutDirection from '../LayoutDirection/LayoutDirection.ts'
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
    closedTabs: [],
    fileIconCache: {},
    height,
    homeDirUri: '',
    iframes: [],
    initial: true,
    layout: {
      activeGroupId: -1,
      direction: LayoutDirection.Horizontal,
      groups: [],
    },
    maxOpenEditorGroups: -1,
    maxOpenEditors: -1,
    minGroupHeightPx: 80,
    minGroupWidthPx: 250,
    platform,
    pointerDownGroupIndex: -1,
    pointerDownTabIndex: -1,
    splitButtonEnabled: false,
    tabHeight,
    uid,
    width,
    workspaceuri: uri,
    x,
    y,
  }
  set(uid, state, state)
}
