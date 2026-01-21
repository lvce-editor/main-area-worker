import { MenuEntryId } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'

export const handleTabContextMenu = async (state: MainAreaState, x: number, y: number): Promise<MainAreaState> => {
  Assert.number(x)
  Assert.number(y)
  const { uid } = state
  await ContextMenu.show2(uid, MenuEntryId.Tab, x, y, {
    menuId: MenuEntryId.Tab,
  })
  return state
}
