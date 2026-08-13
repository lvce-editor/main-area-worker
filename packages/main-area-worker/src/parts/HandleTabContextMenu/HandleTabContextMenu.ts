import { MenuEntryId } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'

export const handleTabContextMenu = async (
  state: MainAreaState,
  button: number,
  x: number,
  y: number,
  groupIndexRaw: string = '',
  tabIndexRaw: string = '',
): Promise<MainAreaState> => {
  Assert.number(x)
  Assert.number(y)
  const { uid } = state
  const groupIndex = Number.parseInt(groupIndexRaw)
  const tabIndex = Number.parseInt(tabIndexRaw)
  const group = state.layout.groups[groupIndex]
  const tab = group?.tabs[tabIndex]
  const target = group && tab ? { groupId: group.id, tabId: tab.id } : {}
  await ContextMenu.show2(uid, MenuEntryId.Tab, x, y, {
    menuId: MenuEntryId.Tab,
    ...target,
  })
  return state
}
