import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../src/parts/EditorGroup/EditorGroup.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEditorGroup } from '../src/parts/RenderEditorGroup/RenderEditorGroup.ts'

test('renderEditorGroup should return correct structure for group with active tab', () => {
  const group: EditorGroup = {
    activeTabId: 1,
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
        title: 'Test File',
        uri: '/path/to/Test File',
      },
    ],
  }
  const result = renderEditorGroup(group, 0, true)

  expect(result).toEqual([
    {
      childCount: 2,
      className: 'EditorGroup',
      style: 'width:100%;',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'EditorGroupHeader',
      onDblClick: DomEventListenerFunctions.HandleHeaderDoubleClick,
      role: 'none',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'MainTabs',
      role: 'tablist',
      type: VirtualDomElements.Div,
    },
    {
      'aria-selected': true,
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
      role: 'none',
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
    {
      childCount: 1,
      className: 'EditorGroupActions',
      role: 'toolbar',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorGroupActionButton SplitEditorGroupButton',
      'data-action': 'split-right',
      'data-groupId': '1',
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: 'Split Editor Group',
      type: VirtualDomElements.Button,
    },
    text('split'),
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
    text(''),
  ])
})

test('renderEditorGroup should handle group with no active tab', () => {
  const group: EditorGroup = {
    activeTabId: 999,
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
        title: 'Test File',
        uri: '/path/to/Test File',
      },
    ],
  }
  const result = renderEditorGroup(group, 0, true)

  expect(result.length).toBe(16) // 1 (EditorGroup) + 1 (EditorGroupHeader) + 1 (MainTabs) + 7 (Tab + Icon) + 1 (EditorGroupActions) + 1 (SplitButton) + 1 (text) + 4 (EditorContainer + Editor)
})

test('renderEditorGroup should handle group with custom editor', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: false,
    id: 1,
    isEmpty: false,
    size: 100,
    tabs: [
      {
        editorType: 'custom',
        editorUid: -1,
        icon: '',
        id: 1,
        isDirty: false,
        title: 'Custom Tab',
        uri: '/path/to/Custom Tab',
      },
    ],
  }
  const result = renderEditorGroup(group, 0, true)

  expect(result.length).toBe(16) // 1 (EditorGroup) + 1 (EditorGroupHeader) + 1 (MainTabs) + 7 (Tab + Icon) + 1 (EditorGroupActions) + 1 (SplitButton) + 1 (text) + 4 (EditorContainer + CustomEditor)
})

test('renderEditorGroup should handle empty tabs array', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }
  const result = renderEditorGroup(group, 0, true)

  expect(result).toEqual([
    {
      childCount: 2,
      className: 'EditorGroup',
      style: 'width:100%;',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EmptyGroupCloseButton',
      'data-action': 'close-group',
      'data-groupId': '1',
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: 'Close Editor Group',
      type: VirtualDomElements.Button,
    },
    text('✕'),
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
    text(''),
  ])
})
