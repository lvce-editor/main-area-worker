import { MenuEntryId } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const NoGroupId = -1
const RendererWorkerForwardDelay = 50

export const handleContextMenu = async (state: MainAreaState, rawGroupId: string | undefined, x: number, y: number): Promise<MainAreaState> => {
  const { uid } = state
  Assert.number(x)
  Assert.number(y)
  if (rawGroupId === undefined) {
    return state
  }
  const groupId = rawGroupId === '' ? NoGroupId : Number(rawGroupId)
  if (Number.isNaN(groupId)) {
    return state
  }
  if (RendererProcess.isConnected()) {
    setTimeout(() => {
      void ContextMenu.show2(uid, MenuEntryId.Main, x, y, {
        groupId,
        menuId: MenuEntryId.Main,
      })
    }, RendererWorkerForwardDelay)
    return state
  }
  await ContextMenu.show2(uid, MenuEntryId.Main, x, y, {
    groupId,
    menuId: MenuEntryId.Main,
  })
  return state
}
