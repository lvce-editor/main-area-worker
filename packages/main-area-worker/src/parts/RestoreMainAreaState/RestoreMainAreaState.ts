import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { isValidMainAreaLayout } from '../IsValidMainAreaLayout/IsValidMainAreaLayout.ts'

interface SavedMainAreaState {
  layout: MainAreaState['layout']
  version: string
}

export const restoreMainState = (value: unknown): MainAreaLayout => {
  if (!isValidMainAreaLayout(value)) {
    throw new Error('Invalid layout: value does not match MainAreaLayout type')
  }
  return value
}

export const restoreMainAreaState = (savedState: string, currentState: MainAreaState): MainAreaState => {
  try {
    const parsed: SavedMainAreaState = JSON.parse(savedState)

    // Normalize all tabs to have editorUid: -1 so SelectTab will create viewlets
    // Mark all restored tabs as not dirty
    // Only normalize if the layout structure is valid
    const normalizedLayout =
      parsed.layout && Array.isArray(parsed.layout.groups)
        ? {
            ...parsed.layout,
            groups: parsed.layout.groups.map((group: any) => ({
              ...group,
              tabs: Array.isArray(group.tabs)
                ? group.tabs.map((tab: any) => ({
                    ...tab,
                    editorUid: -1,
                    isDirty: false,
                    isPreview: false,
                  }))
                : group.tabs,
            })),
          }
        : parsed.layout

    return {
      ...currentState,
      layout: normalizedLayout,
    }
  } catch (error) {
    console.error('Failed to restore main area state:', error)
    return currentState
  }
}
