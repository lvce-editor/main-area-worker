import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMainAreaVirtualDom } from '../src/parts/GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'
import { CSS_CLASSES as ClassNames } from '../src/parts/MainAreaStyles/MainAreaStyles.ts'

test('getMainAreaVirtualDom should return correct structure for single group', () => {
  const layout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
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
      },
    ],
  }
  const result = getMainAreaVirtualDom(layout)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'Main',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.EDITOR_GROUPS_CONTAINER,
      type: VirtualDomElements.Div,
    },
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

test('getMainAreaVirtualDom should handle multiple groups', () => {
  const layout = {
    activeGroupId: 1,
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 1,
        focused: false,
        id: 1,
        size: 50,
        tabs: [
          {
            content: 'content 1',
            editorType: 'text' as const,
            id: 1,
            isDirty: false,
            path: '/path/to/File 1',
            title: 'File 1',
          },
        ],
      },
      {
        activeTabId: 2,
        focused: false,
        id: 2,
        size: 50,
        tabs: [
          {
            content: 'content 2',
            editorType: 'text' as const,
            id: 2,
            isDirty: true,
            path: '/path/to/File 2',
            title: 'File 2',
          },
        ],
      },
    ],
  }
  const result = getMainAreaVirtualDom(layout)

  expect(result.length).toBe(24) // 1 (Main) + 1 (EditorGroupsContainer) + 22 (2 * renderEditorGroup)
  expect(result[1].childCount).toBe(2)
})

test('getMainAreaVirtualDom should handle empty groups array', () => {
  const layout = {
    activeGroupId: undefined,
    direction: 'horizontal' as const,
    groups: [],
  }
  const result = getMainAreaVirtualDom(layout)

  expect(result.length).toBe(2) // 1 (Main) + 1 (EditorGroupsContainer)
  expect(result[1].childCount).toBe(0)
})
