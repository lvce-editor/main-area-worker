import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { CSS_CLASSES as ClassNames } from '../MainAreaStyles/MainAreaStyles.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const children = []
  for (let i = 0; i < layout.groups.length; i++) {
    if (i > 0) {
      // Insert sash between groups
      children.push(renderSash(layout.direction, i - 1))
    }
    children.push(...renderEditorGroup(layout.groups[i], i, splitButtonEnabled))
  }
  return [
    {
      childCount: 1,
      className: 'Main',
      type: VirtualDomElements.Div,
    },
    {
      childCount: children.length,
      className: ClassNames.EDITOR_GROUPS_CONTAINER,
      role: 'none',
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}
