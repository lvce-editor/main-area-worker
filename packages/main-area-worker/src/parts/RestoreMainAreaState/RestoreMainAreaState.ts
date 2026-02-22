import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { isValidMainAreaLayout } from '../IsValidMainAreaLayout/IsValidMainAreaLayout.ts'

interface SavedMainAreaState {
  layout: MainAreaState['layout']
  version: string
}

const normalizeLayoutTabsForRestoreMainState = (layout: unknown): unknown => {
  if (!layout || typeof layout !== 'object') {
    return layout
  }
  const value = layout as Record<string, unknown>
  if (!Array.isArray(value.groups)) {
    return layout
  }
  return {
    ...value,
    groups: value.groups.map((group: any) => ({
      ...group,
      tabs: Array.isArray(group?.tabs)
        ? group.tabs.map((tab: any) => ({
            ...tab,
            isPreview: typeof tab?.isPreview === 'boolean' ? tab.isPreview : false,
          }))
        : group?.tabs,
    })),
  }
}

const normalizeLayoutTabsForRestoreMainAreaState = (layout: unknown): unknown => {
  if (!layout || typeof layout !== 'object') {
    return layout
  }
  const value = layout as Record<string, unknown>
  if (!Array.isArray(value.groups)) {
    return layout
  }
  return {
    ...value,
    groups: value.groups.map((group: any) => ({
      ...group,
      tabs: Array.isArray(group?.tabs)
        ? group.tabs.map((tab: any) => ({
            ...tab,
            editorUid: -1,
            isDirty: false,
            isPreview: typeof tab?.isPreview === 'boolean' ? tab.isPreview : false,
          }))
        : group?.tabs,
    })),
  }
}

export const restoreMainState = (value: unknown): MainAreaLayout => {
  const normalizedValue = normalizeLayoutTabsForRestoreMainState(value)
  if (!isValidMainAreaLayout(normalizedValue)) {
    throw new Error('Invalid layout: value does not match MainAreaLayout type')
  }
  return normalizedValue
}

export const restoreMainAreaState = (savedState: string, currentState: MainAreaState): MainAreaState => {
  try {
    const parsed: SavedMainAreaState = JSON.parse(savedState)

    // Normalize all tabs to have editorUid: -1 so SelectTab will create viewlets
    // Mark all restored tabs as not dirty
    // Only normalize if the layout structure is valid
    const normalizedLayout = normalizeLayoutTabsForRestoreMainAreaState(parsed.layout)

    return {
      ...currentState,
      layout: normalizedLayout,
    }
  } catch (error) {
    console.error('Failed to restore main area state:', error)
    return currentState
  }
}
