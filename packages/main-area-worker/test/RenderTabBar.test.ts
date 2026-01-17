import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { renderTabBar } from '../src/parts/RenderTabBar/RenderTabBar.ts'

test('renderTabBar should return correct structure for single tab', () => {
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
  const result = renderTabBar(group)

  expect(result.length).toBe(6) // 1 (MainTabs) + 5 (renderTab)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'MainTabs',
    type: VirtualDomElements.Div,
  })
})

test('renderTabBar should handle multiple tabs', () => {
  const group = {
    activeTabId: 'tab2',
    focused: false,
    id: 'group1',
    size: 100,
    tabs: [
      {
        content: 'content 1',
        editorType: 'text' as const,
        id: 'tab1',
        isDirty: false,
        title: 'File 1',
      },
      {
        content: 'content 2',
        editorType: 'text' as const,
        id: 'tab2',
        isDirty: true,
        title: 'File 2',
      },
    ],
  }
  const result = renderTabBar(group)

  expect(result.length).toBe(11) // 1 (MainTabs) + 5*2 (renderTab for each)
  expect(result[0].childCount).toBe(2)
})

test('renderTabBar should handle empty tabs array', () => {
  const group = {
    activeTabId: '',
    focused: false,
    id: 'group1',
    size: 100,
    tabs: [],
  }
  const result = renderTabBar(group)

  expect(result.length).toBe(1) // Only MainTabs container
  expect(result[0].childCount).toBe(0)
})
