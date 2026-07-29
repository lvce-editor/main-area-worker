import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'

const mainNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.Main,
  type: VirtualDomElements.Div,
}

export const renderSingleEditorGroup = (
  layout: MainAreaLayout,
  splitButtonEnabled: boolean,
  sizeProperty: 'width' | 'height' = 'width',
): readonly VirtualDomNode[] => {
  return [mainNode, ...renderEditorGroup(layout.groups[0], 0, splitButtonEnabled, sizeProperty, false)]
}
