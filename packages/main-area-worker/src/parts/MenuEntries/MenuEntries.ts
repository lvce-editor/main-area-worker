import { MenuEntryId } from '@lvce-editor/constants'
import * as MenuEntriesMain from '../MenuEntriesMain/MenuEntriesMain.ts'
import * as MenuEntriesTab from '../MenuEntriesTab/MenuEntriesTab.ts'

export const getQuickPickMenuEntries = (): readonly any[] => {
  return [
    {
      id: 'Main.splitRight',
      label: 'Main: Split Right',
    },
    {
      id: 'Main.splitLeft',
      label: 'Main: Split Left',
    },
    {
      id: 'Main.splitDown',
      label: 'Main: Split Down',
    },
    {
      id: 'Main.splitUp',
      label: 'Main: Split Up',
    },
    {
      id: 'Main.reopenEditorWith',
      label: 'Main: Reopen Editor With',
    },
  ]
}

export const menus = []

export const getMenuEntries = async (id: number): Promise<readonly any[]> => {
  switch (id) {
    case MenuEntryId.Main:
      return MenuEntriesMain.getMenuEntries()
    case MenuEntryId.Tab:
      return MenuEntriesTab.getMenuEntries()
    default:
      return []
  }
}
