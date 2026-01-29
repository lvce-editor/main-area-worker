import { type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../../MainAreaState/MainAreaState.ts'

export const renderViewletReference = (tab: Tab): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 0,
      type: 100, // Reference node type - frontend will append the component at this position
      uid: tab.editorUid,
    },
  ]
}
