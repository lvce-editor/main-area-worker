import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import { isValidMainAreaLayout } from '../IsValidMainAreaLayout/IsValidMainAreaLayout.ts'

interface SavedMainAreaState {
  layout: MainAreaState['layout']
  version: string
}

const getMaxIdFromLayout = (layout: MainAreaLayout | undefined): number => {
  let maxId = 0
  if (!layout || !Array.isArray(layout.groups)) {
    return maxId
  }
  for (const group of layout.groups) {
    if (group && typeof group.id === 'number' && group.id > maxId) {
      maxId = group.id
    }
    if (group && Array.isArray(group.tabs)) {
      for (const tab of group.tabs) {
        if (tab && typeof tab.id === 'number' && tab.id > maxId) {
          maxId = tab.id
        }
      }
    }
  }
  return maxId
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
    const maxId = getMaxIdFromLayout(parsed.layout)
    Id.setMinId(maxId)

    return {
      ...currentState,
      layout: parsed.layout,
    }
  } catch (error) {
    console.error('Failed to restore main area state:', error)
    return currentState
  }
}
