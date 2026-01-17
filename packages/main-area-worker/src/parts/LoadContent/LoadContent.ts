import type { MainAreaState, Tab } from '../MainAreaState/MainAreaState.ts'

export const loadContent = async (state: MainAreaState): Promise<MainAreaState> => {
  const tabs: readonly Tab[] = [
    {
      content: '',
      editorType: 'text',
      id: '1',
      isDirty: false,
      title: 'tab 1',
    },
    {
      content: '',
      editorType: 'text',
      id: '2',
      isDirty: false,
      title: 'tab 2',
    },
  ]
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
