import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { renderEditorGroup } from '../src/parts/RenderEditorGroup/RenderEditorGroup.ts'

test('renderEditorGroup should return correct structure for group with active tab', () => {
  const group = {
    activeTabId: 'tab1',
    focused: false,
    id: 'group1',
    size: 100,
    tabs: [
      {
        content: 'test content',
        editorType: 'text' as const,
        id: 'tab1',
        isDirty: false,
        title: 'Test File',
      },
    ],
  }
  const result = renderEditorGroup(group)

  expect(result.length).toBe(11) // 1 (EditorGroup) + 6 (renderTabBar) + 4 (renderEditor)
  expect(result[0]).toEqual({
    childCount: 2,
    className: 'EditorGroup',
    type: VirtualDomElements.Div,
  })
})

test('renderEditorGroup should handle group with no active tab', () => {
  const group = {
    activeTabId: 'nonexistent',
    focused: false,
    id: 'group1',
    size: 100,
    tabs: [
      {
        content: 'test content',
        editorType: 'text' as const,
        id: 'tab1',
        isDirty: false,
        title: 'Test File',
      },
    ],
  }
  const result = renderEditorGroup(group)

  expect(result.length).toBe(9) // 1 (EditorGroup) + 6 (renderTabBar) + 2 (renderEditor with "Tab not found")
})

test('renderEditorGroup should handle group with custom editor', () => {
  const group = {
    activeTabId: 'tab1',
    focused: false,
    id: 'group1',
    size: 100,
    tabs: [
      {
        content: '',
        customEditorId: 'custom-editor-123',
        editorType: 'custom' as const,
        id: 'tab1',
        isDirty: false,
        title: 'Custom Tab',
      },
    ],
  }
  const result = renderEditorGroup(group)

  expect(result.length).toBe(10) // 1 (EditorGroup) + 6 (renderTabBar) + 3 (renderEditor with custom)
})

test('renderEditorGroup should handle empty tabs array', () => {
  const group = {
    activeTabId: '',
    focused: false,
    id: 'group1',
    size: 100,
    tabs: [],
  }
  const result = renderEditorGroup(group)

  expect(result.length).toBe(4) // 1 (EditorGroup) + 1 (renderTabBar) + 2 (renderEditor with "Tab not found")
})
