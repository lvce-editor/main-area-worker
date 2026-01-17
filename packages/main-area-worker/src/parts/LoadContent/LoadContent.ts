import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as GetStatusBarItems from '../GetStatusBarItems/GetStatusBarItems.ts'
import * as StatusBarPreferences from '../StatusBarPreferences/StatusBarPreferences.ts'

export const loadContent = async (state: MainAreaState): Promise<MainAreaState> => {
  const { assetDir, platform } = state
  const statusBarItemsPreference = await StatusBarPreferences.itemsVisible()
  const statusBarItems = await GetStatusBarItems.getStatusBarItems(statusBarItemsPreference, assetDir, platform)
  return {
    ...state,
    statusBarItemsLeft: [...statusBarItems],
    statusBarItemsRight: [],
  }
}
