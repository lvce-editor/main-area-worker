export type EditorType = 'text' | 'custom'

export type SplitDirection = 'left' | 'right' | 'up' | 'down'

export interface Tab {
  readonly content: string
  readonly customEditorId?: string
  readonly editorType: EditorType
  readonly id: string
  readonly isDirty: boolean
  readonly language?: string
  readonly path?: string
  readonly title: string
}

export interface EditorGroup {
  readonly activeTabId: string | undefined
  readonly direction?: 'horizontal' | 'vertical'
  readonly focused: boolean
  readonly id: string
  readonly size: number
  readonly tabs: readonly Tab[]
}

export interface MainAreaLayout {
  readonly activeGroupId: string | undefined
  readonly direction: 'horizontal' | 'vertical'
  readonly groups: readonly EditorGroup[]
}

export interface MainAreaState {
  readonly assetDir: string
  readonly disposed?: boolean
  readonly layout: MainAreaLayout
  readonly platform: number
  readonly uid: number
}
