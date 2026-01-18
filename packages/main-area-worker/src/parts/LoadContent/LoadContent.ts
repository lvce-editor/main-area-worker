import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getTabs } from '../GetTabs/GetTabs.ts'

export const loadContent = async (state: MainAreaState): Promise<MainAreaState> => {
  const tabs = await getTabs()
  return {
    ...state,
    layout: {
      activeGroupId: '0',
      direction: 'horizontal',
      groups: [
        {
          activeTabId: tabs.length > 0 ? tabs[0].id : undefined,
          direction: 'horizontal',
          focused: false,
          id: '0',
          size: 300,
          tabs,
        },
      ],
    },
  }
}
