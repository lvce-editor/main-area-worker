import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getMainAreaVirtualDom } from '../src/parts/GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'

test('getMainAreaVirtualDom should return correct structure for single group', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
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
            isPreview: false,
            title: 'Test File',
            uri: '/path/to/Test File',
          },
        ],
      },
    ],
  }
  const result = getMainAreaVirtualDom(layout, true)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'Main',
      type: VirtualDomElements.Div,
    },
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

test('getMainAreaVirtualDom should handle multiple groups', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: 1,
        focused: false,
        id: 1,
        isEmpty: false,
        size: 50,
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
        ],
      },
      {
        activeTabId: 2,
        focused: false,
        id: 2,
        isEmpty: false,
        size: 50,
        tabs: [
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
      },
    ],
  }
  const result = getMainAreaVirtualDom(layout, true)

  // Find sash node
  const sashNode = result.find((node) => node.className === 'Sash SashVertical')
  expect(sashNode).toBeDefined()
  expect(sashNode?.['data-sashId']).toBe('1:2')
  expect(sashNode?.style).toBe('left:50%;')
  expect(sashNode?.onPointerDown).toBe(DomEventListenerFunctions.HandleSashPointerDown)
  expect(result[1].childCount).toBe(3) // flattened children: group 1 + sash + group 2
  const editorGroupsContainer = result.find((node) => node.className === `${ClassNames.EDITOR_GROUPS_CONTAINER} EditorGroupsVertical`)
  expect(editorGroupsContainer).toBeDefined()
})

test('getMainAreaVirtualDom should add vertical class for split-down layout', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 'vertical',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 50,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        isEmpty: true,
        size: 50,
        tabs: [],
      },
    ],
  }
  const result = getMainAreaVirtualDom(layout)

  const editorGroupsContainer = result.find((node) => node.className === `${ClassNames.EDITOR_GROUPS_CONTAINER} EditorGroupsHorizontal`)
  expect(editorGroupsContainer).toBeDefined()
  const editorGroupNodes = result.filter((node) => node.className === 'EditorGroup')
  expect(editorGroupNodes).toHaveLength(2)
  expect(editorGroupNodes[0].style).toBe('height:50%;')
  expect(editorGroupNodes[1].style).toBe('height:50%;')
})

test('getMainAreaVirtualDom should handle empty groups array', () => {
  const layout: MainAreaLayout = {
    activeGroupId: undefined,
    direction: 'horizontal',
    groups: [],
  }
  const result = getMainAreaVirtualDom(layout)

  expect(result.length).toBe(2) // 1 (Main) + 1 (EditorGroupsContainer)
  expect(result[1].childCount).toBe(0)
})

test('getMainAreaVirtualDom should position sashes at one-third and two-thirds', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 33.333_333,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        isEmpty: true,
        size: 33.333_333,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 3,
        isEmpty: true,
        size: 33.333_334,
        tabs: [],
      },
    ],
  }

  const result = getMainAreaVirtualDom(layout)

  const sashNodes = result.filter((node) => node.className === 'Sash SashVertical')
  expect(sashNodes).toHaveLength(2)
  const firstSashOffset = Number(sashNodes[0].style?.replace('left:', '').replace('%;', ''))
  const secondSashOffset = Number(sashNodes[1].style?.replace('left:', '').replace('%;', ''))
  expect(firstSashOffset).toBeCloseTo(33.333_333, 5)
  expect(secondSashOffset).toBeCloseTo(66.666_666, 5)
})
