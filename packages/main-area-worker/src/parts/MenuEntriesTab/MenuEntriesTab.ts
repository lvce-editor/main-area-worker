import { MenuItemFlags } from '@lvce-editor/constants'
import * as Assert from '../Assert/Assert.ts'
import * as ViewletMainStrings from '../MainStrings/MainStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'

// TODO should pass tab uri as argument or tab index
export const getMenuEntries = (): readonly any[] => {
  const mainState = {} as any
  const { activeGroupIndex } = mainState
  const { groups } = mainState
  const group = groups[activeGroupIndex]
  const { editors } = group
  const editor = editors[group.focusedIndex]
  Assert.object(editor)
  const { uri } = editor
  return [
    {
      command: 'Main.closeFocusedTab',
      flags: MenuItemFlags.None,
      id: 'tabClose',
      label: ViewletMainStrings.close(),
    },
    {
      command: 'Main.closeOthers',
      flags: MenuItemFlags.None,
      id: 'tabCloseOthers',
      label: ViewletMainStrings.closeOthers(),
    },
    {
      command: 'Main.closeTabsRight',
      flags: MenuItemFlags.None,
      id: 'tabCloseToTheRight',
      label: ViewletMainStrings.closeToTheRight(),
    },
    {
      command: 'Main.closeAllEditors',
      flags: MenuItemFlags.None,
      id: 'tabCloseAll',
      label: ViewletMainStrings.closeAll(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      args: [uri],
      command: 'Explorer.revealItem',
      flags: MenuItemFlags.None,
      id: 'revealInExplorer',
      label: ViewletMainStrings.revealInExplorer(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      args: [/* id */ 'References', /* focus */ true, uri],
      command: 'SideBar.show',
      flags: MenuItemFlags.None,
      id: 'findFileReferences',
      label: ViewletMainStrings.findFileReferences(),
    },
  ]
}
