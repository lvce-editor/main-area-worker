import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTabActions } from '../RenderTabActions/RenderTabActions.ts'

export const renderTab = (tab: Tab, isActive: boolean, tabIndex: number, groupIndex: number): readonly VirtualDomNode[] => {
  const closeButtonNodes = renderTabActions(tab.isDirty, tabIndex, groupIndex)
<<<<<<< HEAD
  let className = 'MainTab'
  if (isActive) {
    className += ' MainTabSelected'
  }
  if (tab.isDirty) {
    className += ' MainTabModified'
  }
=======
>>>>>>> origin/main

  return [
    {
      'aria-selected': isActive,
      childCount: 3,
      className,
      'data-groupIndex': groupIndex,
      'data-index': tabIndex,
      onClick: DomEventListenerFunctions.HandleClickTab,
      onContextMenu: DomEventListenerFunctions.HandleTabContextMenu,
      role: 'tab',
      title: tab.uri || tab.title,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'TabIcon',
      role: 'none',
      src: tab.icon,
      type: VirtualDomElements.Img,
    },
    {
      childCount: 1,
      className: 'TabTitle',
      type: VirtualDomElements.Span,
    },
    text(tab.title),
    ...closeButtonNodes,
  ]
}
