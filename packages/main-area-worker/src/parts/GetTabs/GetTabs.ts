import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as Id from '../Id/Id.ts'

export const getTabs = async (): Promise<readonly Tab[]> => {
  const tabs: readonly Tab[] = [
    {
      content: '',
      editorType: 'text',
      editorUid: Id.create(),
      id: Id.create(),
      isDirty: false,
      title: 'tab 1',
    },
    {
      content: '',
      editorType: 'text',
      editorUid: Id.create(),
      id: Id.create(),
      isDirty: false,
      title: 'tab 2',
    },
    {
      content: '',
      editorType: 'text',
      editorUid: Id.create(),
      id: Id.create(),
      isDirty: false,
      title: 'tab 3',
    },
    {
      content: '',
      editorType: 'text',
      editorUid: Id.create(),
      id: Id.create(),
      isDirty: false,
      title: 'tab 4',
    },
    {
      content: '',
      editorType: 'text',
      editorUid: Id.create(),
      id: Id.create(),
      isDirty: false,
      title: 'tab 5',
    },
    {
      content: '',
      editorType: 'text',
      editorUid: Id.create(),
      id: Id.create(),
      isDirty: false,
      title: 'tab 6',
    },
  ]
  return tabs
}
