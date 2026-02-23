import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'

export const renderSingleEditorGroup = (
  layout: MainAreaLayout,
  splitButtonEnabled: boolean,
  sizeProperty: 'width' | 'height',
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.Main,
      type: VirtualDomElements.Div,
    },
    ...renderEditorGroup(layout.groups[0], 0, splitButtonEnabled, sizeProperty),
  ]
}
