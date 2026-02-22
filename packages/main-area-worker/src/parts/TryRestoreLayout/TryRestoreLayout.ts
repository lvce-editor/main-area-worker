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
  if (!layout || typeof layout !== 'object') {
    return undefined
  }

  const rawLayout = layout as Record<string, unknown>
  if (!Array.isArray(rawLayout.groups)) {
    return undefined
  }

  // Normalize all tabs to have editorUid: -1 so SelectTab will create viewlets
  // Mark all restored tabs as not dirty
  const normalizedLayout = {
    ...rawLayout,
    groups: rawLayout.groups.map((group: any) => ({
      ...group,
      tabs: Array.isArray(group?.tabs)
        ? group.tabs.map((tab: any) => ({
            ...tab,
            editorUid: -1,
            isDirty: false,
            isPreview: typeof tab?.isPreview === 'boolean' ? tab.isPreview : false,
          }))
        : [],
    })),
  }

  if (!isValidMainAreaLayout(normalizedLayout)) {
    return undefined
  }

  return normalizedLayout
}
