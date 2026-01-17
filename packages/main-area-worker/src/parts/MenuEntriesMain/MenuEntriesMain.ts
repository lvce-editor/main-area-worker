import { MenuItemFlags } from '@lvce-editor/constants'
import * as ViewletMainStrings from '../MainStrings/MainStrings.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getMenuEntries = (): readonly any[] => {
  return [
    {
      args: [ViewletModuleId.QuickPick, 'file'],
      command: 'Viewlet.openWidget',
      flags: MenuItemFlags.None,
      id: 'openFile',
      label: ViewletMainStrings.openFile(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: 'Main.splitUp',
      flags: MenuItemFlags.None,
      id: 'splitUp',
      label: ViewletMainStrings.splitUp(),
    },
    {
      command: 'Main.splitDown',
      flags: MenuItemFlags.None,
      id: 'splitDown',
      label: ViewletMainStrings.splitDown(),
    },
    {
      command: 'Main.splitLeft',
      flags: MenuItemFlags.None,
      id: 'splitLeft',
      label: ViewletMainStrings.splitLeft(),
    },
    {
      command: 'Main.splitRight',
      flags: MenuItemFlags.None,
      id: 'splitRight',
      label: ViewletMainStrings.splitRight(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: 'Main.newWindow',
      flags: MenuItemFlags.None,
      id: 'newWindow',
      label: ViewletMainStrings.newWindow(),
    },
  ]
}
