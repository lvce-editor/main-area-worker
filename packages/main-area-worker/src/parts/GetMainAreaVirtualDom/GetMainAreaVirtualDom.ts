import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { CSS_CLASSES as ClassNames } from '../MainAreaStyles/MainAreaStyles.ts'
import { renderEditorGroup } from '../RenderEditorGroup/RenderEditorGroup.ts'

export const getMainAreaVirtualDom = (layout: MainAreaLayout): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'Main',
      type: VirtualDomElements.Div,
    },
    {
      childCount: layout.groups.length,
      className: ClassNames.EDITOR_GROUPS_CONTAINER,
      type: VirtualDomElements.Div,
    },
    ...layout.groups.flatMap(renderEditorGroup),
  ]
}
