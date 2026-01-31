import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import { renderEditor } from '../RenderEditor/RenderEditor.ts'
import { renderEditorGroupHeader } from '../RenderEditorGroupHeader/RenderEditorGroupHeader.ts'

export const renderEditorGroup = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)

  return [
    {
      childCount: 2,
      className: 'EditorGroup',
      type: VirtualDomElements.Div,
    },
    ...renderEditorGroupHeader(group, groupIndex, splitButtonEnabled),
    {
      childCount: 1,
      className: 'EditorContainer',
      type: VirtualDomElements.Div,
    },
    ...renderEditor(activeTab),
  ]
}
