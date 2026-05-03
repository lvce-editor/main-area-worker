import { MenuItemFlags, PlatformType } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ViewletMainStrings from '../MainStrings/MainStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

export const getNewWindowMenuEntries = (state: MainAreaState): readonly any[] => {
  if (state.platform !== PlatformType.Electron) {
    return []
  }
  return [
    MenuEntrySeparator.menuEntrySeparator,
    {
      command: 'MainArea.newWindow',
      flags: MenuItemFlags.None,
      id: 'newWindow',
      label: ViewletMainStrings.newWindow(),
    },
  ]
}
