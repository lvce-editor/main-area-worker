import { type VirtualDomNode, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, MainAreaLayout, Tab } from '../MainAreaState/MainAreaState.ts'
import { CSS_CLASSES as ClassNames } from '../MainAreaStyles/MainAreaStyles.ts'

const renderTab = (tab: Tab, isActive: boolean): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 2,
      className: 'MainTab',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'TabTitle',
      type: VirtualDomElements.Span,
    },
    text(tab.isDirty ? `*${tab.title}` : tab.title),
    {
      childCount: 1,
      className: 'EditorTabCloseButton',
      type: VirtualDomElements.Button,
    },
    text('×'),
  ]
}

const renderTabBar = (group: EditorGroup): readonly VirtualDomNode[] => {
  return [
    {
      childCount: group.tabs.length,
      className: 'MainTabs',
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
        className: 'CustomEditor',
        type: VirtualDomElements.Div,
      },
      text(`Custom Editor: ${tab.customEditorId}`),
    ]
  }

  return [
    {
      childCount: 1,
      className: 'TextEditor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent',
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
      className: 'EditorGroup',
      type: VirtualDomElements.Div,
    },
    ...renderTabBar(group),
    {
      childCount: activeTab ? 1 : 1,
      className: 'EditorContainer',
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
