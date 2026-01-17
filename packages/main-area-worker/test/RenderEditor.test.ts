import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { renderEditor } from '../src/parts/RenderEditor/RenderEditor.ts'

test('renderEditor should return "Tab not found" for undefined tab', () => {
  const result = renderEditor(undefined)
  
  expect(result.length).toBe(1)
  expect(result[0]).toEqual({
    childCount: 0,
    text: 'Tab not found',
    type: VirtualDomElements.Text,
  })
})

test('renderEditor should return custom editor structure', () => {
  const tab = {
    content: '',
    customEditorId: 'custom-editor-123',
    editorType: 'custom' as const,
    id: 'tab1',
    isDirty: false,
    title: 'Custom Tab',
  }
  const result = renderEditor(tab)
  
  expect(result.length).toBe(2)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'CustomEditor',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 0,
    text: 'Custom Editor: custom-editor-123',
    type: VirtualDomElements.Text,
  })
})

test('renderEditor should return text editor structure with content', () => {
  const tab = {
    content: 'Hello, World!',
    editorType: 'text' as const,
    id: 'tab1',
    isDirty: false,
    title: 'Test File',
  }
  const result = renderEditor(tab)
  
  expect(result.length).toBe(3)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'TextEditor',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: 'EditorContent',
    type: VirtualDomElements.Pre,
  })
  expect(result[2]).toEqual({
    childCount: 0,
    text: 'Hello, World!',
    type: VirtualDomElements.Text,
  })
})

test('renderEditor should handle text editor with empty content', () => {
  const tab = {
    content: '',
    editorType: 'text' as const,
    id: 'tab1',
    isDirty: false,
    title: 'Empty File',
  }
  const result = renderEditor(tab)
  
  expect(result.length).toBe(3)
  expect(result[2].text).toBe('')
})

test('renderEditor should handle text editor with undefined content', () => {
  const tab = {
    content: '',
    editorType: 'text' as const,
    id: 'tab1',
    isDirty: false,
    title: 'Undefined File',
  }
  const result = renderEditor(tab)
  
  expect(result.length).toBe(3)
  expect(result[2].text).toBe('')
})
