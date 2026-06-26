import type { MenuEntryId } from '@lvce-editor/constants'

interface ContextMenuPropsBase {
  readonly menuId: number
}

interface ContextMenuPropsTab extends ContextMenuPropsBase {
  readonly menuId: typeof MenuEntryId.Tab
}

interface ContextMenuPropsMain extends ContextMenuPropsBase {
  readonly groupId: number
  readonly menuId: typeof MenuEntryId.Main
}

export type ContextMenuProps = ContextMenuPropsTab | ContextMenuPropsMain
