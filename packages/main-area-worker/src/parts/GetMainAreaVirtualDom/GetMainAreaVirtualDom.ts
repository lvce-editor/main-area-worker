import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { CSS_CLASSES, CSS_ATTRIBUTES, CSS_STYLES, getThemeStyles } from '../MainAreaStyles/MainAreaStyles.ts'

const renderTab = (tab: any, isActive: boolean): VirtualDomNode => {
  return {
    attributes: {
      [CSS_ATTRIBUTES.DATA_TAB_ID]: tab.id,
      style: `${CSS_STYLES.TAB_BASE} ${isActive ? CSS_STYLES.TAB_ACTIVE_STYLE : ''}`,
    },
    childCount: 2,
    children: [
      {
        childCount: 1,
        children: [tab.isDirty ? `*${tab.title}` : tab.title],
        className: CSS_CLASSES.TAB_TITLE,
        type: VirtualDomElements.Span,
      },
      {
        attributes: {
          [CSS_ATTRIBUTES.DATA_ACTION]: 'close-tab',
          [CSS_ATTRIBUTES.DATA_TAB_ID]: tab.id,
          style: CSS_STYLES.TAB_CLOSE_STYLE,
        },
        childCount: 1,
        children: ['×'],
        className: CSS_CLASSES.TAB_CLOSE,
        type: VirtualDomElements.Button,
      },
    ],
    className: `${CSS_CLASSES.TAB} ${isActive ? CSS_CLASSES.TAB_ACTIVE : ''}`,
    type: VirtualDomElements.Div,
  }
}

const renderTabBar = (group: any): VirtualDomNode => {
  return {
    attributes: {
      [CSS_ATTRIBUTES.DATA_GROUP_ID]: group.id,
      style: CSS_STYLES.TAB_BAR_BASE,
    },
    childCount: group.tabs.length,
    children: group.tabs.map((tab: any) => renderTab(tab, tab.id === group.activeTabId)),
    className: CSS_CLASSES.TAB_BAR,
    type: VirtualDomElements.Div,
  }
}

const renderEditor = (tab: any): VirtualDomNode => {
  if (tab.editorType === 'custom') {
    return {
      attributes: {
        [CSS_ATTRIBUTES.DATA_CUSTOM_EDITOR_ID]: tab.customEditorId,
        [CSS_ATTRIBUTES.DATA_TAB_ID]: tab.id,
        style: CSS_STYLES.CUSTOM_EDITOR_STYLE,
      },
      childCount: 1,
      children: [`Custom Editor: ${tab.customEditorId}`],
      className: CSS_CLASSES.CUSTOM_EDITOR,
      type: VirtualDomElements.Div,
    }
  }

  return {
    attributes: {
      [CSS_ATTRIBUTES.DATA_LANGUAGE]: tab.language || 'plaintext',
      [CSS_ATTRIBUTES.DATA_TAB_ID]: tab.id,
      style: CSS_STYLES.TEXT_EDITOR_STYLE,
    },
    childCount: 1,
    children: [
      {
        childCount: 1,
        children: [tab.content || ''],
        className: CSS_CLASSES.EDITOR_CONTENT,
        type: VirtualDomElements.Pre,
      },
    ],
    className: CSS_CLASSES.TEXT_EDITOR,
    type: VirtualDomElements.Div,
  }
}

const renderEditorGroup = (group: any): VirtualDomNode => {
  const activeTab = group.tabs.find((tab: any) => tab.id === group.activeTabId)

  return {
    attributes: {
      [CSS_ATTRIBUTES.DATA_GROUP_ID]: group.id,
      style: `${CSS_STYLES.EDITOR_GROUP_BASE} flex: ${group.size}; ${group.focused ? CSS_STYLES.EDITOR_GROUP_FOCUSED_STYLE : ''}`,
    },
    childCount: 2,
    children: [
      renderTabBar(group),
      {
        childCount: activeTab ? 1 : 1,
        children: activeTab
          ? [renderEditor(activeTab)]
          : [
              {
                attributes: {
                  style: CSS_STYLES.EMPTY_EDITOR_STYLE,
                },
                childCount: 1,
                children: ['No open tabs'],
                className: CSS_CLASSES.EMPTY_EDITOR,
                type: VirtualDomElements.Div,
              },
            ],
        className: CSS_CLASSES.EDITOR_CONTAINER,
        type: VirtualDomElements.Div,
      },
    ],
    className: `${CSS_CLASSES.EDITOR_GROUP} ${group.focused ? CSS_CLASSES.EDITOR_GROUP_FOCUSED : ''}`,
    type: VirtualDomElements.Div,
  }
}

export const getMainAreaVirtualDom = (state: MainAreaState): readonly VirtualDomNode[] => {
  return [
    {
      attributes: {
        [CSS_ATTRIBUTES.DATA_DIRECTION]: state.layout.direction,
        style: getThemeStyles('DARK'),
      },
      childCount: 1,
      children: [
        {
          attributes: {
            style: state.layout.direction === 'horizontal' ? CSS_STYLES.FLEX_ROW : CSS_STYLES.FLEX_COLUMN,
          },
          childCount: state.layout.groups.length,
          children: state.layout.groups.map(renderEditorGroup),
          className: CSS_CLASSES.EDITOR_GROUPS_CONTAINER,
          type: VirtualDomElements.Div,
        },
      ],
      className: CSS_CLASSES.MAIN_AREA,
      type: VirtualDomElements.Div,
    },
  ]
}
