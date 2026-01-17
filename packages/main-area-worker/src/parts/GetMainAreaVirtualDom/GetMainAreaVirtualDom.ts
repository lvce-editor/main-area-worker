import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../MainAreaState/MainAreaState.ts'
import { CSS_CLASSES as ClassNames, CSS_ATTRIBUTES, CSS_STYLES } from '../MainAreaStyles/MainAreaStyles.ts'

const renderTab = (tab: any, isActive: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: `${ClassNames.TAB} ${isActive ? ClassNames.TAB_ACTIVE : ''}`,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.TAB_TITLE,
      type: VirtualDomElements.Span,
    },
    text(tab.isDirty ? `*${tab.title}` : tab.title),
    {
      attributes: {
        [CSS_ATTRIBUTES.DATA_ACTION]: 'close-tab',
        [CSS_ATTRIBUTES.DATA_TAB_ID]: tab.id,
        style: CSS_STYLES.TAB_CLOSE_STYLE,
      },
      childCount: 1,
      className: ClassNames.TAB_CLOSE,
      type: VirtualDomElements.Button,
    },
    text('×'),
  ]
}

const renderTabBar = (group: any): readonly VirtualDomNode[] => {
  return [
    {
      childCount: group.tabs.length,
      className: ClassNames.TAB_BAR,
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab: any) => renderTab(tab, tab.id === group.activeTabId)),
  ]
}

const renderEditor = (tab: any): readonly VirtualDomNode[] => {
  if (tab.editorType === 'custom') {
    return [
      {
        attributes: {
          [CSS_ATTRIBUTES.DATA_CUSTOM_EDITOR_ID]: tab.customEditorId,
          [CSS_ATTRIBUTES.DATA_TAB_ID]: tab.id,
          style: CSS_STYLES.CUSTOM_EDITOR_STYLE,
        },
        childCount: 1,
        children: [`Custom Editor: ${tab.customEditorId}`],
        className: ClassNames.CUSTOM_EDITOR,
        type: VirtualDomElements.Div,
      },
    ]
  }

  return [
    {
      childCount: 1,
      children: [],
      className: ClassNames.TEXT_EDITOR,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      children: [],
      className: ClassNames.EDITOR_CONTENT,
      type: VirtualDomElements.Pre,
    },
    text(tab.content || ''),
  ]
}

const renderEditorGroup = (group: any): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)

  return [
    {
      childCount: 2,
      children: [],
      className: `${ClassNames.EDITOR_GROUP} ${group.focused ? ClassNames.EDITOR_GROUP_FOCUSED : ''}`,
      type: VirtualDomElements.Div,
    },
    ...renderTabBar(group),
    {
      childCount: activeTab ? 1 : 1,
      className: ClassNames.EDITOR_CONTAINER,
      type: VirtualDomElements.Div,
    },
    ...renderEditor(activeTab),
  ]
}

export const getMainAreaVirtualDom = (layout: MainAreaLayout): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: ClassNames.MAIN_AREA,
      type: VirtualDomElements.Div,
    },
    {
      childCount: layout.groups.length,
      children: layout.groups.map(renderEditorGroup),
      className: ClassNames.EDITOR_GROUPS_CONTAINER,
      type: VirtualDomElements.Div,
    },
  ]
}
