import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

interface SavedMainAreaState {
  layout: MainAreaState['layout']
  version: string
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
