import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import type { Tab } from '../Tab/Tab.ts'

export type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
export type { EditorType } from '../EditorType/EditorType.ts'
export type { LoadingState } from '../LoadingState/LoadingState.ts'
export type { ViewletState } from '../ViewletState/ViewletState.ts'
export type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
export type { SplitDirection } from '../SplitDirection/SplitDirection.ts'
export type { Tab } from '../Tab/Tab.ts'

export interface SashDragState {
  readonly afterGroupId: number
  readonly afterSize: number
  readonly beforeGroupId: number
  readonly beforeSize: number
  readonly sashId: string
  readonly startClientX: number
  readonly startClientY: number
}

export interface ClosedTabEntry {
  readonly group: EditorGroup
  readonly groupIndex: number
  readonly tab: Tab
  readonly tabIndex: number
}

export interface MainAreaState {
  readonly assetDir: string
  readonly closedTabs: readonly ClosedTabEntry[]
  readonly disposed?: boolean
  readonly fileIconCache: FileIconCache
  readonly height: number
  readonly iframes: readonly any[]
  readonly initial: boolean
  readonly layout: MainAreaLayout
  readonly maxOpenEditorGroups: number
  readonly maxOpenEditors: number
  readonly minGroupWidthPx: number
  readonly platform: number
  readonly sashDrag?: SashDragState
  readonly splitButtonEnabled: boolean
  readonly tabHeight: number
  readonly uid: number
  readonly width: number
  readonly workspaceuri: string
  readonly x: number
  readonly y: number
}
