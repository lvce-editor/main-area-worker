import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditor } from '../RenderEditor/RenderEditor.ts'
import { renderEditorGroupHeader } from '../RenderEditorGroupHeader/RenderEditorGroupHeader.ts'

export const renderEditorGroup = (
  group: EditorGroup,
  groupIndex: number,
  splitButtonEnabled: boolean = false,
  direction: 'horizontal' | 'vertical' = 'horizontal',
  isSplit: boolean = false,
): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)
  const style = direction === 'horizontal' ? `width:${group.size}%;` : `height:${group.size}%;`
  const directionClassName = isSplit ? (direction === 'horizontal' ? ClassNames.EditorGroupHorizontal : ClassNames.EditorGroupVertical) : ''
  const className = directionClassName ? `${ClassNames.EditorGroup} ${directionClassName}` : ClassNames.EditorGroup

  return [
    {
      childCount: 2,
      className,
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
