import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderTab } from '../src/parts/RenderTab/RenderTab.ts'

test('renderTab should return correct structure for clean tab', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 1,
    isDirty: false,
    title: 'Test File',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result).toEqual([
    {
      childCount: 2,
      className: 'MainTab',
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

test('renderTab should show dirty indicator for dirty tab', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 1,
    isDirty: true,
    title: 'Test File',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[2].text).toBe('*Test File')
})

test('renderTab should handle empty title', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 1,
    isDirty: false,
    title: '',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[2].text).toBe('')
})

test('renderTab should handle dirty tab with empty title', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 1,
    isDirty: true,
    title: '',
  }
  const result = renderTab(tab, false, 0, 0)

  expect(result[2].text).toBe('*')
})
