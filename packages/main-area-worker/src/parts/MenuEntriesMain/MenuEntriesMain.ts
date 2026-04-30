import { MenuItemFlags, PlatformType } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ViewletMainStrings from '../MainStrings/MainStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

const hasTargetGroup = (groupId: number | undefined): groupId is number => {
  return groupId !== undefined && groupId >= 0
}

const getArgs = (groupId: number | undefined): readonly number[] | undefined => {
  if (!hasTargetGroup(groupId)) {
    return undefined
  }
  return [groupId]
}

const getNewWindowMenuEntries = (state: MainAreaState): readonly any[] => {
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

export const getMenuEntries = (state: MainAreaState, groupId?: number): readonly any[] => {
  const groupArgs = getArgs(groupId)
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
    ...getNewWindowMenuEntries(state),
  ]
  if (!hasTargetGroup(groupId)) {
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
