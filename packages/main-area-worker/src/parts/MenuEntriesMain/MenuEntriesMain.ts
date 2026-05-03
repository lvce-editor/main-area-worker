import { MenuItemFlags } from '@lvce-editor/constants'
import * as GetMenuEntryArgs from '../GetMenuEntryArgs/GetMenuEntryArgs.ts'
import * as GetNewWindowMenuEntries from '../GetNewWindowMenuEntries/GetNewWindowMenuEntries.ts'
import * as HasTargetGroup from '../HasTargetGroup/HasTargetGroup.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ViewletMainStrings from '../MainStrings/MainStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const getMenuEntries = (state: MainAreaState, groupId?: number): readonly any[] => {
  const groupArgs = GetMenuEntryArgs.getMenuEntryArgs(groupId)
  const entries = [
    {
      args: [ViewletModuleId.QuickPick, 'file'],
      command: 'Viewlet.openWidget',
      flags: MenuItemFlags.None,
      id: 'openFile',
      label: ViewletMainStrings.openFile(),
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      args: groupArgs,
      command: 'MainArea.splitUp',
      flags: MenuItemFlags.None,
      id: 'splitUp',
      label: ViewletMainStrings.splitUp(),
    },
    {
      args: groupArgs,
      command: 'MainArea.splitDown',
      flags: MenuItemFlags.None,
      id: 'splitDown',
      label: ViewletMainStrings.splitDown(),
    },
    {
      args: groupArgs,
      command: 'MainArea.splitLeft',
      flags: MenuItemFlags.None,
      id: 'splitLeft',
      label: ViewletMainStrings.splitLeft(),
    },
    {
      args: groupArgs,
      command: 'MainArea.splitRight',
      flags: MenuItemFlags.None,
      id: 'splitRight',
      label: ViewletMainStrings.splitRight(),
    },
    ...GetNewWindowMenuEntries.getNewWindowMenuEntries(state),
  ]
  if (!HasTargetGroup.hasTargetGroup(groupId)) {
    return entries
  }
  return [
    ...entries,
    MenuEntrySeparator.menuEntrySeparator,
    {
      args: [groupId],
      command: 'MainArea.closeEditorGroup',
      flags: MenuItemFlags.None,
      id: 'closeGroup',
      label: ViewletMainStrings.closeEditorGroup(),
    },
  ]
}
