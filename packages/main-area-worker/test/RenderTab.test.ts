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
    language: '',
    loadingState: 'idle',
    title: 'Test File',
    uri: '/path/to/Test File',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result).toEqual([
    {
      'aria-selected': false,
      childCount: 3,
      className: 'MainTab',
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
  ])
})

test('renderTab should show dirty indicator for dirty tab', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: 1,
    isDirty: true,
    language: '',
    loadingState: 'idle',
    title: 'Test File',
    uri: '/path/to/Test File',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[3].text).toBe('*Test File')
})

test('renderTab should handle empty title', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: '',
    icon: '',
    id: 1,
    isDirty: false,
    language: '',
    loadingState: 'idle',
    title: '',
    uri: '/path/to/file',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[3].text).toBe('')
})

test('renderTab should handle dirty tab with empty title', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: true,
    title: '',
    uri: '/path/to/file',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[3].text).toBe('*')
})

test('renderTab should use title as fallback when path is undefined', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Untitled',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[0].title).toBe('Untitled')
})
