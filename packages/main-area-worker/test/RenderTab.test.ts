import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { renderTab } from '../src/parts/RenderTab/RenderTab.ts'

test('renderTab should return correct structure for clean tab', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 'tab1',
    isDirty: false,
    title: 'Test File',
  }
  const result = renderTab(tab, false)

  expect(result.length).toBe(5)
  expect(result[0]).toEqual({
    childCount: 2,
    className: 'MainTab',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: 'TabTitle',
    type: VirtualDomElements.Span,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    text: 'Test File',
    type: VirtualDomElements.Text,
  })
  expect(result[3]).toEqual({
    childCount: 1,
    className: 'EditorTabCloseButton',
    type: VirtualDomElements.Button,
  })
  expect(result[4]).toEqual({
    childCount: 0,
    text: '×',
    type: VirtualDomElements.Text,
  })
})

test('renderTab should show dirty indicator for dirty tab', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 'tab1',
    isDirty: true,
    title: 'Test File',
  }
  const result = renderTab(tab, false)

  expect(result[2].text).toBe('*Test File')
})

test('renderTab should handle empty title', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 'tab1',
    isDirty: false,
    title: '',
  }
  const result = renderTab(tab, false)

  expect(result[2].text).toBe('')
})

test('renderTab should handle dirty tab with empty title', () => {
  const tab = {
    content: 'test content',
    editorType: 'text' as const,
    id: 'tab1',
    isDirty: true,
    title: '',
  }
  const result = renderTab(tab, false)

  expect(result[2].text).toBe('*')
})
