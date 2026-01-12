import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VirtualDomElements, AriaRoles, text } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const getElementVirtualDom = (element: StatusBarItemElement): readonly VirtualDomNode[] => {
  if (element.type === 'text') {
    return [text(element.value)]
  }
  if (element.type === 'icon') {
    return [
      {
        childCount: 0,
        className: element.value,
        type: VirtualDomElements.Div,
      },
    ]
  }
  return []
}

export const getStatusBarItemVirtualDom = (statusBarItem: StatusBarItem): readonly VirtualDomNode[] => {
  const { elements, name, tooltip } = statusBarItem
  const elementNodes = elements.flatMap(getElementVirtualDom)
  return [
    {
      childCount: elementNodes.length,
      className: ClassNames.StatusBarItem,
      name,
      role: AriaRoles.Button,
      tabIndex: -1,
      title: tooltip,
      type: VirtualDomElements.Button,
    },
    ...elementNodes,
  ]
}
