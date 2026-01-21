import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'

export const getMaxIdFromLayout = (layout: MainAreaLayout): number => {
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
