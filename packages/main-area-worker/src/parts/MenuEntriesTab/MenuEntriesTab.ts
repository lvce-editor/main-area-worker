import { MenuItemFlags } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
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
      command: 'Main.closeSaved',
      flags: MenuItemFlags.None,
      id: 'tabCloseSaved',
      label: ViewletMainStrings.closeSaved(),
    },
    {
      command: 'Main.closeAll',
      flags: MenuItemFlags.None,
      id: 'tabCloseAll',
      label: ViewletMainStrings.closeAll(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      args: [path],
      command: 'Main.copyPath',
      flags: MenuItemFlags.None,
      id: 'copyPath',
      label: ViewletMainStrings.copyPath(),
    },
    {
      args: [path],
      command: 'Main.copyRelativePath',
      flags: MenuItemFlags.None,
      id: 'copyRelativePath',
      label: ViewletMainStrings.copyRelativePath(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'reopenEditorWith',
      label: ViewletMainStrings.reopenEditorWith(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'share',
      label: ViewletMainStrings.share(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'addFileToChat',
      label: ViewletMainStrings.addFileToChat(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'openContainingFolder',
      label: ViewletMainStrings.openContainingFolder(),
    },
    {
      args: [path],
      command: 'Explorer.revealItem',
      flags: MenuItemFlags.None,
      id: 'revealInExplorerView',
      label: ViewletMainStrings.revealInExplorerView(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'keepOpen',
      label: ViewletMainStrings.keepOpen(),
    },
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'pin',
      label: ViewletMainStrings.pin(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: 'Main.splitRight',
      flags: MenuItemFlags.None,
      id: 'splitRight',
      label: ViewletMainStrings.splitRight(),
    },
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'splitAndMove',
      label: ViewletMainStrings.splitAndMove(),
    },
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'moveIntoNewWindow',
      label: ViewletMainStrings.moveIntoNewWindow(),
    },
    {
      command: '',
      flags: MenuItemFlags.None,
      id: 'copyIntoNewWindow',
      label: ViewletMainStrings.copyIntoNewWindow(),
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
