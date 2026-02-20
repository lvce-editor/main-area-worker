import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditor } from '../RenderEditor/RenderEditor.ts'
import { renderEditorGroupHeader } from '../RenderEditorGroupHeader/RenderEditorGroupHeader.ts'
import { renderEmptyEditorGroup } from '../RenderEmptyEditorGroup/RenderEmptyEditorGroup.ts'

export const renderEditorGroup = (
  group: EditorGroup,
  groupIndex: number,
  splitButtonEnabled: boolean = false,
  sizeProperty: 'width' | 'height' = 'width',
): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)
  const style = `${sizeProperty}:${group.size}%;`
  const hasTabs = group.tabs.length > 0
  const hasEmptyGroupCloseButton = !hasTabs

  if (hasEmptyGroupCloseButton) {
    return renderEmptyEditorGroup(group, groupIndex, style)
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
