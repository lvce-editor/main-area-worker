import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getMaxIdFromLayout } from '../GetMaxIdFromLayout/GetMaxIdFromLayout.ts'
import * as Id from '../Id/Id.ts'
import { tryRestoreLayout } from '../TryRestoreLayout/TryRestoreLayout.ts'

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
