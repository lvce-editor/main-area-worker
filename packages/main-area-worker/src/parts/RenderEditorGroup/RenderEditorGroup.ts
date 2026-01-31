import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import { renderEditor } from '../RenderEditor/RenderEditor.ts'
import { renderEditorGroupHeader } from '../RenderEditorGroupHeader/RenderEditorGroupHeader.ts'
import { renderEmptyGroupCloseButton } from '../RenderEmptyGroupCloseButton/RenderEmptyGroupCloseButton.ts'

export const renderEditorGroup = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  if (group.isEmpty) {
    return renderEmptyGroup(group, groupIndex)
  }

  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)

  return [
    {
      childCount: 2,
      className: 'EditorGroup',
      type: VirtualDomElements.Div,
    },
    ...renderEditorGroupHeader(group, groupIndex, splitButtonEnabled),
    {
      childCount: activeTab ? 1 : 1,
      className: 'EditorContainer',
      type: VirtualDomElements.Div,
    },
    ...renderEditor(activeTab),
  ]
}

const renderEmptyGroup = (group: EditorGroup, groupIndex: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'EditorGroup EmptyEditorGroup',
      type: VirtualDomElements.Div,
    },
    ...renderEmptyGroupCloseButton(group, groupIndex),
  ]
}
