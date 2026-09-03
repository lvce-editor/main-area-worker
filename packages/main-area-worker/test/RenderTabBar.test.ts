import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTabBar } from '../src/parts/RenderTabBar/RenderTabBar.ts'

test('renderTabBar should return correct structure for single tab', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    direction: 1,
    focused: false,
    id: 1,
    isEmpty: false,
    size: 100,
    tabs: [
      {
        editorType: 'text',
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        isPreview: false,
        title: 'Test File',
        uri: '/path/to/Test File',
      },
    ],
  }
  const result = renderTabBar(group, 0)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'MainTabs',
      'data-groupIndex': 0,
      onDragOver: DomEventListenerFunctions.HandleTabsDragOver,
      onWheel: DomEventListenerFunctions.HandleTabsWheel,
      role: 'tablist',
      type: VirtualDomElements.Div,
    },
    {
      'aria-selected': true,
      childCount: 2,
      className: 'MainTab MainTabSelected',
      'data-groupIndex': 0,
      'data-index': 0,
      draggable: true,
      onContextMenu: DomEventListenerFunctions.HandleTabContextMenu,
      onDblClick: DomEventListenerFunctions.HandleDoubleClick,
      onDragEnd: DomEventListenerFunctions.HandleDragEnd,
      onDragOver: DomEventListenerFunctions.HandleTabDragOver,
      onDragStart: DomEventListenerFunctions.HandleDragStart,
      onKeyDown: DomEventListenerFunctions.HandleTabKeyDown,
      onMouseDown: DomEventListenerFunctions.HandleClickTab,
      onMouseUp: DomEventListenerFunctions.HandleTabMouseUp,
      role: 'tab',
      tabIndex: 0,
      title: '/path/to/Test File',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'TabTitle',
      type: VirtualDomElements.Span,
    },
    text('Test File'),
    {
      'aria-label': 'Close',
      childCount: 1,
      className: 'EditorTabCloseButton',
      'data-groupIndex': 0,
      'data-index': 0,
      onClick: DomEventListenerFunctions.HandleClickClose,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
      type: VirtualDomElements.Div,
    },
  ])
})

test('renderTabBar should handle multiple tabs', () => {
  const group: EditorGroup = {
    activeTabId: 2,
    direction: 1,
    focused: false,
    id: 1,
    isEmpty: false,
    size: 100,
    tabs: [
      {
        editorType: 'text',
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        isPreview: false,
        title: 'File 1',
        uri: '/path/to/File 1',
      },
      {
        editorType: 'text',
        editorUid: -1,
        icon: '',
        id: 2,
        isDirty: true,
        isPreview: false,
        title: 'File 2',
        uri: '/path/to/File 2',
      },
    ],
  }
  const result = renderTabBar(group, 0)

  expect(result).toHaveLength(11) // 1 (MainTabs) + 5*2 (renderTab without icons for each)
  expect(result[0].childCount).toBe(2)
})

test('renderTabBar should handle empty tabs array', () => {
  const group: EditorGroup = {
    activeTabId: -1,
    direction: 1,
    focused: false,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }
  const result = renderTabBar(group, 0)

  expect(result).toHaveLength(1) // Only MainTabs container
  expect(result[0].childCount).toBe(0)
})
