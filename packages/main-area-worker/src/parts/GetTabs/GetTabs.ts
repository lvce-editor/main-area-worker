import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'

export const getTabs = async (): Promise<readonly Tab[]> => {
  const tabs: readonly Tab[] = [
    {
      editorType: 'text',
      editorUid: Id.create(),
      icon: '',
      id: Id.create(),
      isDirty: false,
      title: 'tab 1',
    },
    {
      editorType: 'text',
      editorUid: Id.create(),
      icon: '',
      id: Id.create(),
      isDirty: false,
      title: 'tab 2',
    },
    {
      editorType: 'text',
      editorUid: Id.create(),
      icon: '',
      id: Id.create(),
      isDirty: false,
      title: 'tab 3',
    },
    {
      editorType: 'text',
      editorUid: Id.create(),
      icon: '',
      id: Id.create(),
      isDirty: false,
      title: 'tab 4',
    },
    {
      editorType: 'text',
      editorUid: Id.create(),
      icon: '',
      id: Id.create(),
      isDirty: false,
      title: 'tab 5',
    },
    {
      editorType: 'text',
      editorUid: Id.create(),
      icon: '',
      id: Id.create(),
      isDirty: false,
      title: 'tab 6',
    },
  ]
  return tabs
}
