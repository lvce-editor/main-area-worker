import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import { renderEditor } from '../RenderEditor/RenderEditor.ts'
import { renderTabBar } from '../RenderTabBar/RenderTabBar.ts'

export const renderEditorGroup = (group: EditorGroup): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)

  return [
    {
      childCount: 2,
      className: 'EditorGroup',
      type: VirtualDomElements.Div,
    },
    ...renderTabBar(group),
    {
      childCount: activeTab ? 1 : 1,
      className: 'EditorContainer',
      type: VirtualDomElements.Div,
    },
    ...renderEditor(activeTab),
  ]
}
