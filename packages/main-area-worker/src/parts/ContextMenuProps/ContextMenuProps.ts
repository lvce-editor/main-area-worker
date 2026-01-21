import type { MenuEntryId } from '@lvce-editor/constants'

export interface ContextMenuPropsBase {
  readonly menuId: number
}

export interface ContextMenuPropsTab extends ContextMenuPropsBase {
  readonly menuId: typeof MenuEntryId.Tab
}

export type ContextMenuProps = ContextMenuPropsTab
