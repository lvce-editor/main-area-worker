import type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'

export type { EditorGroup } from '../EditorGroup/EditorGroup.ts'
export type { EditorType } from '../EditorType/EditorType.ts'
export type { LoadingState } from '../LoadingState/LoadingState.ts'
export type { ViewletState } from '../ViewletState/ViewletState.ts'
export type { MainAreaLayout } from '../MainAreaLayout/MainAreaLayout.ts'
export type { SplitDirection } from '../SplitDirection/SplitDirection.ts'
export type { Tab } from '../Tab/Tab.ts'

export interface MainAreaState {
  readonly assetDir: string
  readonly disposed?: boolean
  readonly height: number
  readonly layout: MainAreaLayout
  readonly platform: number
  readonly uid: number
  readonly width: number
  readonly x: number
  readonly y: number
}
