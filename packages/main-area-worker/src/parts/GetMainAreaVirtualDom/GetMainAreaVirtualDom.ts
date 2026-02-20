import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'
import { renderSash } from '../RenderSash/RenderSash.ts'
import * as SashId from '../SashId/SashId.ts'

export const getMainAreaVirtualDom = (layout: MainAreaLayout, splitButtonEnabled: boolean = false): readonly VirtualDomNode[] => {
  const children = []
  for (let i = 0; i < layout.groups.length; i++) {
    if (i > 0) {
      // Insert sash between groups
      const beforeGroupId = layout.groups[i - 1].id
      const afterGroupId = layout.groups[i].id
      const sashId = SashId.create(beforeGroupId, afterGroupId)
      children.push(renderSash(layout.direction, sashId))
    }
    children.push(...renderEditorGroup(layout.groups[i], i, splitButtonEnabled, layout.direction))
  }
  return [
    {
      childCount: 1,
      className: ClassNames.Main,
      type: VirtualDomElements.Div,
    },
    {
      childCount: children.length,
      className: ClassNames.EDITOR_GROUPS_CONTAINER,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...children,
  ]
}
