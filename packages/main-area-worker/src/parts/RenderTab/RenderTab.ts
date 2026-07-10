import { type VirtualDomNode, AriaRoles, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTabActions } from '../RenderTabActions/RenderTabActions.ts'

const ExtensionDetailScheme = 'extension-detail://'

const renderTabIcon = (tab: Tab): readonly VirtualDomNode[] => {
  if (tab.uri?.startsWith(ExtensionDetailScheme)) {
    return [
      {
        childCount: 1,
        className: ClassNames.TabIcon,
        role: AriaRoles.None,
        type: VirtualDomElements.Div,
      },
      {
        childCount: 0,
        className: ClassNames.MaskIconExtensions,
        type: VirtualDomElements.Div,
      },
    ]
  }
  return [
    {
      childCount: 0,
      className: ClassNames.TabIcon,
      role: AriaRoles.None,
      src: tab.icon,
      type: VirtualDomElements.Img,
    },
  ]
}

export const renderTab = (tab: Tab, isActive: boolean, tabIndex: number, groupIndex: number): readonly VirtualDomNode[] => {
  const closeButtonNodes = renderTabActions(tab.isDirty, tabIndex, groupIndex)
  let className = ClassNames.MainTab
  if (isActive) {
    className += ' ' + ClassNames.MainTabSelected
  }
  if (tab.isDirty) {
    className += ' ' + ClassNames.MainTabModified
  }
  if (tab.isPreview) {
    className += ' ' + ClassNames.MainTabPreview
  }

  return [
    {
      'aria-selected': isActive,
      childCount: 3,
      className,
      'data-groupIndex': groupIndex,
      'data-index': tabIndex,
      onContextMenu: DomEventListenerFunctions.HandleTabContextMenu,
      onMouseDown: DomEventListenerFunctions.HandleClickTab,
      role: 'tab',
      title: tab.uriTitle || tab.uri || tab.title,
      type: VirtualDomElements.Div,
    },
    ...renderTabIcon(tab),
    {
      childCount: 1,
      className: ClassNames.TabTitle,
      type: VirtualDomElements.Span,
    },
    text(tab.title),
    ...closeButtonNodes,
  ]
}
