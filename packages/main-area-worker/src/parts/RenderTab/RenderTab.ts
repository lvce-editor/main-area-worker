import { type VirtualDomNode, AriaRoles, mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTabActions } from '../RenderTabActions/RenderTabActions.ts'

const ExtensionDetailScheme = 'extension-detail://'
const KeyBindingsUri = 'app://keybindings'
const RunningExtensionsScheme = 'running-extensions://'

const tabIconNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TabIcon,
  role: AriaRoles.None,
  type: VirtualDomElements.Div,
}

const tabTitleNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TabTitle,
  type: VirtualDomElements.Span,
}

const renderMaskIcon = (className: string): readonly VirtualDomNode[] => {
  return [
    tabIconNode,
    {
      childCount: 0,
      className,
      type: VirtualDomElements.Div,
    },
  ]
}

const renderTabIcon = (tab: Tab): readonly VirtualDomNode[] => {
  if (tab.uri === KeyBindingsUri) {
    return renderMaskIcon(ClassNames.MaskIconRecordKey)
  }
  if (tab.uri?.startsWith(ExtensionDetailScheme)) {
    return renderMaskIcon(ClassNames.MaskIconExtensions)
  }
  if (tab.uri?.startsWith(RunningExtensionsScheme)) {
    return renderMaskIcon(ClassNames.MaskIconExtensions)
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
    className = mergeClassNames(className, ClassNames.MainTabSelected)
  }
  if (tab.isDirty) {
    className = mergeClassNames(className, ClassNames.MainTabModified)
  }
  if (tab.isPreview) {
    className = mergeClassNames(className, ClassNames.MainTabPreview)
  }

  return [
    {
      'aria-selected': isActive,
      childCount: 3,
      className,
      'data-groupIndex': groupIndex,
      'data-index': tabIndex,
      onContextMenu: DomEventListenerFunctions.HandleTabContextMenu,
      onDblClick: DomEventListenerFunctions.HandleDoubleClick,
      onMouseDown: DomEventListenerFunctions.HandleClickTab,
      role: AriaRoles.Tab,
      title: tab.uriTitle || tab.uri || tab.title,
      type: VirtualDomElements.Div,
    },
    ...renderTabIcon(tab),
    tabTitleNode,
    text(tab.title),
    ...closeButtonNodes,
  ]
}
