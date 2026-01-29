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

    return {
      ...currentState,
      layout: parsed.layout,
    }
  } catch (error) {
    console.error('Failed to restore main area state:', error)
    return currentState
  }
}
