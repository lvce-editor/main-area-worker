import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderEditorGroupActions } from '../src/parts/RenderEditorGroupActions/RenderEditorGroupActions.ts'

test('renderEditorGroupActions should return empty array when splitButtonEnabled is false and no HTML file', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
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
        title: 'test.ts',
        uri: '/path/to/test.ts',
      },
    ],
  }

  const result = renderEditorGroupActions(group, 0, false)

  expect(result).toEqual([])
})

test('renderEditorGroupActions should render split button when splitButtonEnabled is true', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
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
        title: 'test.ts',
        uri: '/path/to/test.ts',
      },
    ],
  }

  const result = renderEditorGroupActions(group, 0, true)

  const expectedArray = [
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
  ]

  expect(result).toEqual(expectedArray)
})

test('renderEditorGroupActions should render toggle preview button for HTML files', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
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
        title: 'test.html',
        uri: '/path/to/test.html',
      },
    ],
  }

  const result = renderEditorGroupActions(group, 0, false)

  const expectedArray = [
    {
      childCount: 1,
      className: 'EditorGroupActions',
      role: 'toolbar',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorGroupActionButton TogglePreviewButton',
      'data-action': 'toggle-preview',
      'data-groupId': '1',
      name: 'toggle-preview',
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: 'Toggle Preview',
      type: VirtualDomElements.Button,
    },
  ]

  expect(result).toEqual(expectedArray)
})

test('renderEditorGroupActions should not render toggle preview button for non-HTML files', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
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
        title: 'test.ts',
        uri: '/path/to/test.ts',
      },
    ],
  }

  const result = renderEditorGroupActions(group, 0, false)

  expect(result).toEqual([])
})

test('renderEditorGroupActions should render both buttons when HTML file and splitButtonEnabled is true', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
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
        title: 'test.html',
        uri: '/path/to/test.html',
      },
    ],
  }

  const result = renderEditorGroupActions(group, 0, true)

  const expectedArray = [
    {
      childCount: 2,
      className: 'EditorGroupActions',
      role: 'toolbar',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorGroupActionButton TogglePreviewButton',
      'data-action': 'toggle-preview',
      'data-groupId': '1',
      name: 'toggle-preview',
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: 'Toggle Preview',
      type: VirtualDomElements.Button,
    },
    undefined,
    {
      childCount: 1,
      className: 'EditorGroupActionButton SplitEditorGroupButton',
      'data-action': 'split-right',
      'data-groupId': '1',
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: 'Split Editor Group',
      type: VirtualDomElements.Button,
    },
  ]

  expect(result).toEqual(expectedArray)
})

test('renderEditorGroupActions should not render toggle preview button when tab has no uri', () => {
  const group: EditorGroup = {
    activeTabId: 1,
    focused: true,
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
        title: 'Untitled',
      },
    ],
  }

  const result = renderEditorGroupActions(group, 0, false)

  expect(result).toEqual([])
})

test('renderEditorGroupActions should not render toggle preview button when no active tab', () => {
  const group: EditorGroup = {
    activeTabId: 2,
    focused: true,
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
        title: 'test.html',
        uri: '/path/to/test.html',
      },
    ],
  }

  const result = renderEditorGroupActions(group, 0, false)

  expect(result).toEqual([])
})

test('renderEditorGroupActions should handle empty tabs array', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: true,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = renderEditorGroupActions(group, 0, false)

  expect(result).toEqual([])
})
