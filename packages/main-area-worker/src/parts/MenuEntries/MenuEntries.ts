import { MenuEntryId } from '@lvce-editor/constants'
import type { ContextMenuProps } from '../ContextMenuProps/ContextMenuProps.ts'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as MenuEntriesTab from '../MenuEntriesTab/MenuEntriesTab.ts'

export const getMenuEntries = async (state: MainAreaState, props: ContextMenuProps): Promise<readonly any[]> => {
  switch (props.menuId) {
    case MenuEntryId.Tab:
      return MenuEntriesTab.getMenuEntries(state)
    default:
      return []
  }
}
