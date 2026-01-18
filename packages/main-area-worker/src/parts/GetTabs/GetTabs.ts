import type { Tab } from '../MainAreaState/MainAreaState.ts'

export const getTabs = async (): Promise<readonly Tab[]> => {
  const tabs: readonly Tab[] = [
    {
      content: '',
      editorType: 'text',
      id: 1,
      isDirty: false,
      title: 'tab 1',
    },
    {
      content: '',
      editorType: 'text',
      id: 2,
      isDirty: false,
      title: 'tab 2',
    },
  ]
  return tabs
}
