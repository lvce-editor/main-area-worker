import { type VirtualDomNode, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, TabDropIndicator } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { getEditorGroupClassName } from '../GetEditorGroupClassName/GetEditorGroupClassName.ts'
import { renderEditor } from '../RenderEditor/RenderEditor.ts'
import { renderEditorGroupHeader } from '../RenderEditorGroupHeader/RenderEditorGroupHeader.ts'
import { renderEmptyEditorGroup } from '../RenderEmptyEditorGroup/RenderEmptyEditorGroup.ts'

const editorContainerNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorContainer,
  type: VirtualDomElements.Div,
}

export const renderEditorGroup = (
  group: EditorGroup,
  groupIndex: number,
  splitButtonEnabled: boolean = false,
  sizeProperty: 'width' | 'height' = 'width',
  closeButtonEnabled: boolean = true,
  tabDropIndicator?: TabDropIndicator,
): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)
  const style = `${sizeProperty}:${group.size}%;`
  const hasTabs = group.tabs.length > 0
  const hasEmptyGroupCloseButton = !hasTabs

  if (hasEmptyGroupCloseButton) {
    return renderEmptyEditorGroup(group, groupIndex, style, closeButtonEnabled)
  }

  return [
    {
      childCount: 2,
      className: mergeClassNames(ClassNames.EditorGroup, getEditorGroupClassName(group.id)),
      'data-groupId': String(group.id),
      style,
      type: VirtualDomElements.Div,
    },
    ...renderEditorGroupHeader(group, groupIndex, splitButtonEnabled, tabDropIndicator),
    editorContainerNode,
    ...renderEditor(activeTab),
  ]
}
