import type { MainAreaLayout, MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'
import { isValidMainAreaLayout } from '../IsValidMainAreaLayout/IsValidMainAreaLayout.ts'

const getMaxIdFromLayout = (layout: MainAreaLayout): number => {
  let maxId = 0
  for (const group of layout.groups) {
    if (group.id > maxId) {
      maxId = group.id
    }
    for (const tab of group.tabs) {
      if (tab.id > maxId) {
        maxId = tab.id
      }
    }
  }
  return maxId
}

const tryRestoreLayout = (savedState: unknown): MainAreaLayout | undefined => {
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

export const loadContent = async (state: MainAreaState, savedState: unknown): Promise<MainAreaState> => {
  const restoredLayout = tryRestoreLayout(savedState)
  if (restoredLayout) {
    const maxId = getMaxIdFromLayout(restoredLayout)
    Id.setMinId(maxId)
    return {
      ...state,
      layout: restoredLayout,
    }
  }
  return {
    ...state,
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
}
