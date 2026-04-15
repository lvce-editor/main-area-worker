import type { MenuEntryId } from '@lvce-editor/constants'

export interface ContextMenuPropsBase {
  readonly menuId: number
}

export interface ContextMenuPropsTab extends ContextMenuPropsBase {
  readonly menuId: typeof MenuEntryId.Tab
}

export interface ContextMenuPropsMain extends ContextMenuPropsBase {
  readonly groupId: number
  readonly menuId: typeof MenuEntryId.Main
}

export type ContextMenuProps = ContextMenuPropsTab | ContextMenuPropsMain
