import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, MainAreaLayout, Tab } from '../MainAreaState/MainAreaState.ts'
import { CSS_CLASSES as ClassNames } from '../MainAreaStyles/MainAreaStyles.ts'

const renderTab = (tab: Tab, isActive: boolean): readonly VirtualDomNode[] => {
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
      childCount: 1,
      className: ClassNames.TAB_CLOSE,
      type: VirtualDomElements.Button,
    },
    text('×'),
  ]
}

const renderTabBar = (group: EditorGroup): readonly VirtualDomNode[] => {
  return [
    {
      childCount: group.tabs.length,
      className: ClassNames.TAB_BAR,
      type: VirtualDomElements.Div,
    },
    ...group.tabs.flatMap((tab) => renderTab(tab, tab.id === group.activeTabId)),
  ]
}

const renderEditor = (tab: Tab | undefined): readonly VirtualDomNode[] => {
  if (!tab) {
    return [text('Tab not found')]
  }
  if (tab.editorType === 'custom') {
    return [
      {
        childCount: 1,
        className: ClassNames.CUSTOM_EDITOR,
        type: VirtualDomElements.Div,
      },
      text(`Custom Editor: ${tab.customEditorId}`),
    ]
  }

  return [
    {
      childCount: 1,
      className: ClassNames.TEXT_EDITOR,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.EDITOR_CONTENT,
      type: VirtualDomElements.Pre,
    },
    text(tab.content || ''),
  ]
}

const renderEditorGroup = (group: EditorGroup): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)

  return [
    {
      childCount: 2,
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
