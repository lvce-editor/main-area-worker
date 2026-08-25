import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../src/parts/Tab/Tab.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTab } from '../src/parts/RenderTab/RenderTab.ts'

test('renderTab should return correct structure for clean tab', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    language: '',
    loadingState: 'idle',
    title: 'Test File',
    uri: '/path/to/Test File',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result).toEqual([
    {
      'aria-selected': false,
      childCount: 2,
      className: 'MainTab',
      'data-groupIndex': 0,
      'data-index': 0,
      draggable: true,
      onContextMenu: DomEventListenerFunctions.HandleTabContextMenu,
      onDblClick: DomEventListenerFunctions.HandleDoubleClick,
      onDragEnd: DomEventListenerFunctions.HandleDragEnd,
      onDragStart: DomEventListenerFunctions.HandleDragStart,
      onKeyDown: DomEventListenerFunctions.HandleTabKeyDown,
      onMouseDown: DomEventListenerFunctions.HandleClickTab,
      onMouseUp: DomEventListenerFunctions.HandleTabMouseUp,
      role: 'tab',
      tabIndex: -1,
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

test('renderTab should not render an empty file icon', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    language: '',
    loadingState: 'idle',
    title: 'Test File',
    uri: '/path/to/Test File',
  }

  const result = renderTab(tab, false, 0, 0)

  expect(result[0].childCount).toBe(2)
  expect(result.some((node) => node.className === 'TabIcon' && node.type === VirtualDomElements.Img)).toBe(false)
})

test('renderTab should use the extensions mask icon for running extensions', () => {
  const tab: Tab = {
    editorType: 'custom',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    language: '',
    loadingState: 'idle',
    title: 'Running Extensions',
    uri: 'running-extensions://',
  }

  const result = renderTab(tab, true, 0, 0)

  expect(result[1]).toEqual({
    childCount: 1,
    className: 'TabIcon',
    role: 'none',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    className: 'MaskIcon MaskIconExtensions',
    type: VirtualDomElements.Div,
  })
})

test('renderTab should use the search mask icon for search editors', () => {
  const tab: Tab = {
    editorType: 'custom',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'Search',
    uri: 'search-editor://42-123/Search',
  }

  const result = renderTab(tab, true, 0, 0)

  expect(result[1]).toEqual({
    childCount: 1,
    className: 'TabIcon',
    role: 'none',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    className: 'MaskIcon MaskIconSearch',
    type: VirtualDomElements.Div,
  })
})

test('renderTab should show dirty indicator for dirty tab', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: 1,
    isDirty: true,
    isPreview: false,
    language: '',
    loadingState: 'idle',
    title: 'Test File',
    uri: '/path/to/Test File',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result).toEqual([
    {
      'aria-selected': false,
      childCount: 2,
      className: 'MainTab MainTabModified',
      'data-groupIndex': 0,
      'data-index': 0,
      draggable: true,
      onContextMenu: DomEventListenerFunctions.HandleTabContextMenu,
      onDblClick: DomEventListenerFunctions.HandleDoubleClick,
      onDragEnd: DomEventListenerFunctions.HandleDragEnd,
      onDragStart: DomEventListenerFunctions.HandleDragStart,
      onKeyDown: DomEventListenerFunctions.HandleTabKeyDown,
      onMouseDown: DomEventListenerFunctions.HandleClickTab,
      onMouseUp: DomEventListenerFunctions.HandleTabMouseUp,
      role: 'tab',
      tabIndex: -1,
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
      className: 'MaskIcon MaskIconCircleFilled',
      type: VirtualDomElements.Div,
    },
  ])
})

test('renderTab should handle empty title', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    language: '',
    loadingState: 'idle',
    title: '',
    uri: '/path/to/file',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[2].text).toBe('')
})

test('renderTab should put the active tab in the keyboard tab sequence', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'Test File',
  }

  const result = renderTab(tab, true, 0, 0)

  expect(result[0].tabIndex).toBe(0)
})

test('renderTab should handle dirty tab with empty title', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: true,
    isPreview: false,
    title: '',
    uri: '/path/to/file',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[2].text).toBe('')
  expect(result[4].className).toBe('MaskIcon MaskIconCircleFilled')
})

test('renderTab should use title as fallback when path is undefined', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'Untitled',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[0].title).toBe('Untitled')
})

test('renderTab should prefer uriTitle for the tab tooltip', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'file.md',
    uri: 'file:///home/user/file.md',
    uriTitle: '~/file.md',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[0].title).toBe('~/file.md')
  expect(result[2].text).toBe('file.md')
})

test('renderTab should add preview class for preview tabs', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: true,
    title: 'Preview File',
    uri: '/path/to/preview',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[0].className).toBe('MainTab MainTabPreview')
})

test('renderTab should use the built-in keyboard icon for the Keyboard Shortcuts tab', () => {
  const tab: Tab = {
    editorType: 'custom',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'Keyboard Shortcuts',
    uri: 'app://keybindings',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[1]).toEqual({
    childCount: 1,
    className: 'TabIcon',
    role: 'none',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    className: 'MaskIcon MaskIconRecordKey',
    type: VirtualDomElements.Div,
  })
})

test('renderTab should use the built-in extensions icon for extension detail tabs', () => {
  const tab: Tab = {
    editorType: 'custom',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    isPreview: false,
    title: 'builtin.theme-ayu',
    uri: 'extension-detail://builtin.theme-ayu',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[1]).toEqual({
    childCount: 1,
    className: 'TabIcon',
    role: 'none',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    className: 'MaskIcon MaskIconExtensions',
    type: VirtualDomElements.Div,
  })
})
