import { MenuEntryId } from '@lvce-editor/constants'
import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'

export const handleContextMenu = async (state: any, x: number, y: number): Promise<any> => {
  Assert.number(x)
  Assert.number(y)
  await ContextMenu.show(x, y, MenuEntryId.Main)
  return state
}
