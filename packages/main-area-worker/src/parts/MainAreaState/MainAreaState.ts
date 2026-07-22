import type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
import type { Tab } from '../Tab/Tab.ts'

export type { EditorGroup } from '../EditorGroup/EditorGroup.ts'

export type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
export type { SplitDirection } from '../SplitDirection/SplitDirection.ts'
export type { Tab } from '../Tab/Tab.ts'

interface SashDragState {
  readonly afterGroupId: number
  readonly afterSize: number
  readonly beforeGroupId: number
  readonly beforeSize: number
  readonly sashId: string
  readonly startClientX: number
  readonly startClientY: number
}

interface SashCornerDragState {
  readonly groupSizes: readonly {
    readonly id: number
    readonly size: number
  }[]
  readonly startClientX: number
  readonly startClientY: number
  readonly xAfterGroupIds: readonly number[]
  readonly xBeforeGroupIds: readonly number[]
  readonly yAfterGroupIds: readonly number[]
  readonly yBeforeGroupIds: readonly number[]
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
  readonly homeDirUri?: string
  readonly iframes: readonly any[]
  readonly initial: boolean
  readonly layout: MainAreaLayout
  readonly maxOpenEditorGroups: number
  readonly maxOpenEditors: number
  readonly minGroupHeightPx: number
  readonly minGroupWidthPx: number
  pendingViewletUpdate?: {
    readonly disposal: number
    readonly focus?: number
  }
  readonly platform: number
  readonly sashCornerDrag?: SashCornerDragState
  readonly sashDrag?: SashDragState
  readonly splitButtonEnabled: boolean
  readonly tabHeight: number
  readonly uid: number
  readonly width: number
  readonly workspaceuri: string
  readonly x: number
  readonly y: number
}
