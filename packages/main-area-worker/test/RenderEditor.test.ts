import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { renderEditor } from '../src/parts/RenderEditor/RenderEditor.ts'

test('renderEditor should return empty editor container for undefined tab', () => {
  const result = renderEditor(undefined)

  expect(result).toEqual([
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

test('renderEditor should return custom editor structure', () => {
  const tab = {
    content: '',
    customEditorId: 'custom-editor-123',
    editorType: 'custom' as const,
    id: 1,
    isDirty: false,
    title: 'Custom Tab',
  }
  const result = renderEditor(tab)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'CustomEditor',
      type: VirtualDomElements.Div,
    },
    text('Custom Editor: custom-editor-123'),
  ])
})

test('renderEditor should return text editor structure with content', () => {
  const tab = {
    content: 'Hello, World!',
    editorType: 'text' as const,
    id: 1,
    isDirty: false,
    title: 'Test File',
  }
  const result = renderEditor(tab)

  expect(result).toEqual([
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
    text('Hello, World!'),
  ])
})

test('renderEditor should handle text editor with empty content', () => {
  const tab = {
    content: '',
    editorType: 'text' as const,
    id: 1,
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
    id: 1,
    isDirty: false,
    title: 'Undefined File',
  }
  const result = renderEditor(tab)

  expect(result.length).toBe(3)
  expect(result[2].text).toBe('')
})
