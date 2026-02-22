import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { isValidMainAreaLayout } from '../IsValidMainAreaLayout/IsValidMainAreaLayout.ts'

export const tryRestoreLayout = (savedState: unknown): MainAreaLayout | undefined => {
  if (savedState === undefined || savedState === null) {
    return undefined
  }
  if (typeof savedState !== 'object') {
    return undefined
  }
  const { layout } = savedState as Record<string, unknown>
  if (!isValidMainAreaLayout(layout)) {
    return undefined
  }

  // Normalize all tabs to have editorUid: -1 so SelectTab will create viewlets
  // Mark all restored tabs as not dirty
  const normalizedLayout = {
    ...layout,
    groups: layout.groups.map((group) => ({
      ...group,
      tabs: group.tabs.map((tab) => ({
        ...tab,
        editorUid: -1,
        isDirty: false,
        isPreview: false,
      })),
    })),
  }

  return normalizedLayout
}
