import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditor } from '../RenderEditor/RenderEditor.ts'
import { renderEditorGroupHeader } from '../RenderEditorGroupHeader/RenderEditorGroupHeader.ts'
import { renderEmptyGroupCloseButton } from '../RenderEmptyGroupCloseButton/RenderEmptyGroupCloseButton.ts'

export const renderEditorGroup = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)
  const style = `width:${group.size}%;`
  const hasTabs = group.tabs.length > 0
  const hasEmptyGroupCloseButton = !hasTabs

  if (hasEmptyGroupCloseButton) {
    return [
      {
        childCount: 1,
        className: ClassNames.EditorGroup,
        style,
        type: VirtualDomElements.Div,
      },
      ...renderEmptyGroupCloseButton(group, groupIndex),
    ]
  }

  return [
    {
      childCount: 2,
      className: ClassNames.EditorGroup,
      style,
      type: VirtualDomElements.Div,
    },
    ...renderEditorGroupHeader(group, groupIndex, splitButtonEnabled),
    {
      childCount: 1,
      className: ClassNames.EditorContainer,
      type: VirtualDomElements.Div,
    },
    ...renderEditor(activeTab),
  ]
}
