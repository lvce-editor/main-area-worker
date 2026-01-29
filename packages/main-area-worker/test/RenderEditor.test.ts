import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { Tab } from '../src/parts/Tab/Tab.ts'
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
  const tab: Tab = {
    editorType: 'custom',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Custom Tab',
  }
  const result = renderEditor(tab)

  // Custom editors without loadingState='loaded' render as text content
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

test('renderEditor should return text editor structure with content', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
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
    text(''),
  ])
})

test('renderEditor should handle text editor with empty content', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Empty File',
  }
  const result = renderEditor(tab)

  expect(result.length).toBe(3)
  expect(result[2].text).toBe('')
})

test('renderEditor should handle text editor with undefined content', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Undefined File',
  }
  const result = renderEditor(tab)

  expect(result.length).toBe(3)
  expect(result[2].text).toBe('')
})

test('renderEditor should show loading state', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    loadingState: 'loading',
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
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: 'File not found',
    icon: '',
    id: 1,
    isDirty: false,
    loadingState: 'error',
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
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    loadingState: 'loaded',
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
    text(''),
  ])
})

test('renderEditor should show content when loadingState is idle', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    loadingState: 'idle',
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
    text(''),
  ])
})

test('renderEditor should show error state even when content exists', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    errorMessage: 'Permission denied',
    icon: '',
    id: 1,
    isDirty: false,
    loadingState: 'error',
    title: 'Error File',
  }
  const result = renderEditor(tab)

  expect(result[2]).toEqual(text('Error: Permission denied'))
})
