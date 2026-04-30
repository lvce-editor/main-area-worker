import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { isValidMainAreaLayout } from '../IsValidMainAreaLayout/IsValidMainAreaLayout.ts'
import { normalizeLayoutDirection } from '../LayoutDirection/LayoutDirection.ts'

const normalizeRestoredTab = (tab: any): any => {
  const { errorMessage: _errorMessage, loadingState: _loadingState, ...rest } = tab ?? {}
  return {
    ...rest,
    editorUid: -1,
    isDirty: false,
    isPreview: typeof tab?.isPreview === 'boolean' ? tab.isPreview : false,
  }
}

export const tryRestoreLayout = (savedState: unknown): MainAreaLayout | undefined => {
  if (savedState === undefined || savedState === null) {
    return undefined
  }
  if (typeof savedState !== 'object') {
    return undefined
  }
  const { layout } = savedState as Record<string, unknown>
  if (!layout || typeof layout !== 'object') {
    return undefined
  }

  const rawLayout = layout as Record<string, unknown>
  if (!Array.isArray(rawLayout.groups)) {
    return undefined
  }

  const layoutDirection = normalizeLayoutDirection(rawLayout.direction)
  if (layoutDirection === undefined) {
    return undefined
  }

  // Normalize all tabs to have editorUid: -1 so SelectTab will create viewlets
  // Mark all restored tabs as not dirty
  const normalizedLayout = {
    ...rawLayout,
    direction: layoutDirection,
    groups: rawLayout.groups.map((group: any) => {
      const groupDirection = normalizeLayoutDirection(group?.direction)
      return {
        ...group,
        ...(groupDirection === undefined ? {} : { direction: groupDirection }),
        tabs: Array.isArray(group?.tabs) ? group.tabs.map(normalizeRestoredTab) : [],
      }
    }),
  }

  if (!isValidMainAreaLayout(normalizedLayout)) {
    return undefined
  }

  return normalizedLayout
}
