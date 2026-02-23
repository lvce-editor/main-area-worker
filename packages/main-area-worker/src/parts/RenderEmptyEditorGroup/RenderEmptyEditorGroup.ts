import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEmptyGroupCloseButton } from '../RenderEmptyGroupCloseButton/RenderEmptyGroupCloseButton.ts'
import { renderWaterMark } from '../RenderWaterMark/RenderWaterMark.ts'

export const renderEmptyEditorGroup = (group: EditorGroup, groupIndex: number, style: string): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: ClassNames.EditorGroup,
      style,
      type: VirtualDomElements.Div,
    },
    ...renderEmptyGroupCloseButton(group, groupIndex),
    ...renderWaterMark(),
  ]
}
