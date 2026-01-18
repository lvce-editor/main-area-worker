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
    {
      content: '',
      editorType: 'text',
      id: 3,
      isDirty: false,
      title: 'tab 3',
    },
    {
      content: '',
      editorType: 'text',
      id: 4,
      isDirty: false,
      title: 'tab 4',
    },
    {
      content: '',
      editorType: 'text',
      id: 5,
      isDirty: false,
      title: 'tab 5',
    },
    {
      content: '',
      editorType: 'text',
      id: 6,
      isDirty: false,
      title: 'tab 6',
    },
  ]
  return tabs
}
