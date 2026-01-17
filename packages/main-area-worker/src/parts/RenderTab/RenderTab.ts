import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'

export const renderTab = (tab: Tab, isActive: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'MainTab',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'TabTitle',
      type: VirtualDomElements.Span,
    },
    text(tab.isDirty ? `*${tab.title}` : tab.title),
    {
      childCount: 1,
      className: 'EditorTabCloseButton',
      type: VirtualDomElements.Button,
    },
    text('×'),
  ]
}
