import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTabBar } from '../src/parts/RenderTabBar/RenderTabBar.ts'

test('renderTabBar should return correct structure for single tab', () => {
  const group = {
    activeTabId: 1,
    focused: false,
    id: 1,
    size: 100,
    tabs: [
      {
        content: 'test content',
        editorType: 'text' as const,
        id: 1,
        isDirty: false,
        title: 'Test File',
      },
    ],
  }
  const result = renderTabBar(group, 0)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'MainTabs',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'MainTab MainTabSelected',
      'data-groupIndex': 0,
      'data-index': 0,
      onClick: DomEventListenerFunctions.HandleClickTab,
      onContextMenu: DomEventListenerFunctions.HandleTabContextMenu,
      role: 'tab',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'TabTitle',
      type: VirtualDomElements.Span,
    },
    text('Test File'),
    {
      childCount: 1,
      className: 'EditorTabCloseButton',
      'data-groupIndex': 0,
      'data-index': 0,
      onClick: DomEventListenerFunctions.HandleClickClose,
      type: VirtualDomElements.Button,
    },
    text('×'),
  ])
})

test('renderTabBar should handle multiple tabs', () => {
  const group = {
    activeTabId: 2,
    focused: false,
    id: 1,
    size: 100,
    tabs: [
      {
        content: 'content 1',
        editorType: 'text' as const,
        id: 1,
        isDirty: false,
        title: 'File 1',
      },
      {
        content: 'content 2',
        editorType: 'text' as const,
        id: 2,
        isDirty: true,
        title: 'File 2',
      },
    ],
  }
  const result = renderTabBar(group, 0)

  expect(result.length).toBe(11) // 1 (MainTabs) + 5*2 (renderTab for each)
  expect(result[0].childCount).toBe(2)
})

test('renderTabBar should handle empty tabs array', () => {
  const group = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    size: 100,
    tabs: [],
  }
  const result = renderTabBar(group, 0)

  expect(result.length).toBe(1) // Only MainTabs container
  expect(result[0].childCount).toBe(0)
})
