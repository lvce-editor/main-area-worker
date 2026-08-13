import type { MenuEntryId } from '@lvce-editor/constants'

interface ContextMenuPropsBase {
  readonly menuId: number
}

interface ContextMenuPropsTab extends ContextMenuPropsBase {
  readonly groupId?: number
  readonly menuId: typeof MenuEntryId.Tab
  readonly tabId?: number
}

interface ContextMenuPropsMain extends ContextMenuPropsBase {
  readonly groupId: number
  readonly menuId: typeof MenuEntryId.Main
}

export type ContextMenuProps = ContextMenuPropsTab | ContextMenuPropsMain
