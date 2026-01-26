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
    editorUid: -1,
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
    editorUid: -1,
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
    editorUid: -1,
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
    editorUid: -1,
              editorType: 'text' as const,
    id: 1,
    isDirty: false,
    title: 'Undefined File',
  }
  const result = renderEditor(tab)

  expect(result.length).toBe(3)
  expect(result[2].text).toBe('')
})

test('renderEditor should show loading state', () => {
  const tab = {
    content: '',
    editorUid: -1,
              editorType: 'text' as const,
    id: 1,
    isDirty: false,
    loadingState: 'loading' as const,
    title: 'Loading File',
  }
  const result = renderEditor(tab)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'TextEditor TextEditor--loading',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--loading',
      type: VirtualDomElements.Div,
    },
    text('Loading...'),
  ])
})

test('renderEditor should show error state', () => {
  const tab = {
    content: '',
    editorUid: -1,
              editorType: 'text' as const,
    errorMessage: 'File not found',
    id: 1,
    isDirty: false,
    loadingState: 'error' as const,
    title: 'Error File',
  }
  const result = renderEditor(tab)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'TextEditor TextEditor--error',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--error',
      type: VirtualDomElements.Div,
    },
    text('Error: File not found'),
  ])
})

test('renderEditor should show content when loadingState is loaded', () => {
  const tab = {
    content: 'File content here',
    editorUid: -1,
              editorType: 'text' as const,
    id: 1,
    isDirty: false,
    loadingState: 'loaded' as const,
    title: 'Loaded File',
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
    text('File content here'),
  ])
})

test('renderEditor should show content when loadingState is idle', () => {
  const tab = {
    content: 'Initial content',
    editorUid: -1,
              editorType: 'text' as const,
    id: 1,
    isDirty: false,
    loadingState: 'idle' as const,
    title: 'Idle File',
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
    text('Initial content'),
  ])
})

test('renderEditor should show error state even when content exists', () => {
  const tab = {
    content: 'some old content',
    editorUid: -1,
              editorType: 'text' as const,
    errorMessage: 'Permission denied',
    id: 1,
    isDirty: false,
    loadingState: 'error' as const,
    title: 'Error File',
  }
  const result = renderEditor(tab)

  expect(result[2]).toEqual(text('Error: Permission denied'))
})
