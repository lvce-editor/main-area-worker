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
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        title: 'Test File',
        uri: '/path/to/Test File',
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
      childCount: 3,
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
      childCount: 0,
      className: 'TabIcon',
      src: '',
      type: VirtualDomElements.Img,
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
    {
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
      type: VirtualDomElements.Div,
    },
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
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        title: 'Test File',
        uri: '/path/to/Test File',
      },
    ],
  }
  const result = renderEditorGroup(group, 0)

  expect(result.length).toBe(12) // 1 (EditorGroup) + 7 (renderTabBar with TabIcon) + 4 (renderEditor with empty container)
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
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        title: 'Custom Tab',
        uri: '/path/to/Custom Tab',
      },
    ],
  }
  const result = renderEditorGroup(group, 0)

  expect(result.length).toBe(12) // 1 (EditorGroup) + 7 (renderTabBar with TabIcon) + 4 (renderEditor with content)
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
