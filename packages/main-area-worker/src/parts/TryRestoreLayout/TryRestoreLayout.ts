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
  return layout
}
