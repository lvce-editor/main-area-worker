import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout, TabDropIndicator } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'

const mainNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.Main,
  onDragLeave: DomEventListenerFunctions.HandleDragLeave,
  onDragOver: DomEventListenerFunctions.HandleDragOver,
  onDrop: DomEventListenerFunctions.HandleDrop,
  type: VirtualDomElements.Div,
}

export const renderSingleEditorGroup = (
  layout: MainAreaLayout,
  splitButtonEnabled: boolean,
  sizeProperty: 'width' | 'height' = 'width',
  tabDropIndicator?: TabDropIndicator,
): readonly VirtualDomNode[] => {
  const { groups } = layout
  return [mainNode, ...renderEditorGroup(groups[0], 0, splitButtonEnabled, sizeProperty, false, tabDropIndicator)]
}
