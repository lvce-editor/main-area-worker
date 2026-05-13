interface SavedTab {
  readonly id: number
  readonly path?: string
  readonly title?: string
  readonly uri?: string
}

interface SavedGroup {
  readonly activeTabId?: number
  readonly id: number
  readonly tabs: readonly SavedTab[]
}

interface SavedLayout {
  readonly activeGroupId?: number
  readonly direction?: number
  readonly groups: readonly SavedGroup[]
}

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message)
  }
}

export const assertSavedStateLayout = (savedState: unknown, label: string): SavedLayout => {
  assert(!!savedState && typeof savedState === 'object', `${label} must be an object`)
  const { layout } = savedState as { readonly layout?: unknown }
  assert(!!layout && typeof layout === 'object', `${label}.layout must be an object`)
  const { groups } = layout as { readonly groups?: unknown }
  assert(Array.isArray(groups), `${label}.layout.groups must be an array`)
  return layout as SavedLayout
}
