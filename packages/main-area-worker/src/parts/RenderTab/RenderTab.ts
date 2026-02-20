import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTabActions } from '../RenderTabActions/RenderTabActions.ts'

export const renderTab = (tab: Tab, isActive: boolean, tabIndex: number, groupIndex: number): readonly VirtualDomNode[] => {
  const closeButtonNodes = renderTabActions(tab.isDirty, tabIndex, groupIndex)
  let className = ClassNames.MainTab
  if (isActive) {
    className += ' ' + ClassNames.MainTabSelected
  }
  if (tab.isDirty) {
    className += ' ' + ClassNames.MainTabModified
  }

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
<<<<<<< HEAD
      className: 'TabIcon',
      role: AriaRoles.None,
=======
      className: ClassNames.TabIcon,
      role: 'none',
>>>>>>> origin/main
      src: tab.icon,
      type: VirtualDomElements.Img,
    },
    {
      childCount: 1,
      className: ClassNames.TabTitle,
      type: VirtualDomElements.Span,
    },
    text(tab.title),
    ...closeButtonNodes,
  ]
}
