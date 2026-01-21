import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEditorGroup } from '../src/parts/RenderEditorGroup/RenderEditorGroup.ts'

test('renderEditorGroup should return correct structure for group with active tab', () => {
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
        path: '/path/to/Test File',
        title: 'Test File',
      },
    ],
  }
  const result = renderEditorGroup(group, 0)

  expect(result).toEqual([
    {
      childCount: 2,
      className: 'EditorGroup',
      type: VirtualDomElements.Div,
    },
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
      childCount: 1,
      className: 'EditorTabCloseButton',
      'data-groupIndex': 0,
      'data-index': 0,
      onClick: DomEventListenerFunctions.HandleClickClose,
      type: VirtualDomElements.Button,
    },
    text('×'),
    {
      childCount: 1,
      className: 'EditorContainer',
      type: VirtualDomElements.Div,
    },
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
    text('test content'),
  ])
})

test('renderEditorGroup should handle group with no active tab', () => {
  const group = {
    activeTabId: 999,
    focused: false,
    id: 1,
    size: 100,
    tabs: [
      {
        content: 'test content',
        editorType: 'text' as const,
        id: 1,
        isDirty: false,
        path: '/path/to/Test File',
        title: 'Test File',
      },
    ],
  }
  const result = renderEditorGroup(group, 0)

  expect(result.length).toBe(11) // 1 (EditorGroup) + 6 (renderTabBar) + 4 (renderEditor with empty container)
})

test('renderEditorGroup should handle group with custom editor', () => {
  const group = {
    activeTabId: 1,
    focused: false,
    id: 1,
    size: 100,
    tabs: [
      {
        content: '',
        customEditorId: 'custom-editor-123',
        editorType: 'custom' as const,
        id: 1,
        isDirty: false,
        path: '/path/to/Custom Tab',
        title: 'Custom Tab',
      },
    ],
  }
  const result = renderEditorGroup(group, 0)

  expect(result.length).toBe(10) // 1 (EditorGroup) + 6 (renderTabBar) + 3 (renderEditor with custom)
})

test('renderEditorGroup should handle empty tabs array', () => {
  const group = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    size: 100,
    tabs: [],
  }
  const result = renderEditorGroup(group, 0)

  expect(result.length).toBe(6) // 1 (EditorGroup) + 1 (renderTabBar) + 4 (renderEditor with empty container)
})
