import { MenuItemFlags } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Assert from '../Assert/Assert.ts'
import { findGroupById } from '../FindGroupById/FindGroupById.ts'
import * as ViewletMainStrings from '../MainStrings/MainStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

// TODO should pass tab uri as argument or tab index
export const getMenuEntries = (state: MainAreaState): readonly any[] => {
  const { layout } = state
  const { activeGroupId } = layout
  const group = findGroupById(state, activeGroupId || 0)
  if (!group) {
    return []
  }
  const { activeTabId, tabs } = group
  const tab = tabs.find((t) => t.id === activeTabId)
  if (!tab) {
    return []
  }
  const { uri: path } = tab
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
      args: [path],
      command: 'Explorer.revealItem',
      flags: MenuItemFlags.None,
      id: 'revealInExplorer',
      label: ViewletMainStrings.revealInExplorer(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      args: [/* id */ 'References', /* focus */ true, path],
      command: 'SideBar.show',
      flags: MenuItemFlags.None,
      id: 'findFileReferences',
      label: ViewletMainStrings.findFileReferences(),
    },
  ]
}
