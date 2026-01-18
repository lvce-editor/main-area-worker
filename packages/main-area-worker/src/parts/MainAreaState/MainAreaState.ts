import type { MainAreaLayout } from './MainAreaLayout.ts'

export type { EditorGroup } from './EditorGroup.ts'
export type { EditorType } from './EditorType.ts'
export type { MainAreaLayout } from './MainAreaLayout.ts'
export type { SplitDirection } from './SplitDirection.ts'
export type { Tab } from './Tab.ts'

export interface MainAreaState {
  readonly assetDir: string
  readonly disposed?: boolean
  readonly layout: MainAreaLayout
  readonly platform: number
  readonly uid: number
}
