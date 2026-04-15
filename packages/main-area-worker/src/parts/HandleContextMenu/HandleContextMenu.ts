import { MenuEntryId } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'

export const handleContextMenu = async (state: MainAreaState, rawGroupId: string | undefined, x: number, y: number): Promise<MainAreaState> => {
  Assert.number(x)
  Assert.number(y)
  if (!rawGroupId) {
    return state
  }
  const groupId = Number.parseInt(rawGroupId, 10)
  if (Number.isNaN(groupId)) {
    return state
  }
  await ContextMenu.show2(state.uid, MenuEntryId.Main, x, y, {
    groupId,
    menuId: MenuEntryId.Main,
  })
  return state
}
