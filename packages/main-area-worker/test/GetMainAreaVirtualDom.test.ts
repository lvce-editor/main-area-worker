import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { getMainAreaVirtualDom } from '../src/parts/GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'
import { CSS_CLASSES as ClassNames } from '../src/parts/MainAreaStyles/MainAreaStyles.ts'

test('getMainAreaVirtualDom should return correct structure for single group', () => {
  const layout = {
    activeGroupId: 'group1',
    direction: 'horizontal' as const,
    groups: [
      {
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
      },
    ],
  }
  const result = getMainAreaVirtualDom(layout)
  
  expect(result.length).toBe(13) // 1 (Main) + 1 (EditorGroupsContainer) + 11 (renderEditorGroup)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'Main',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: ClassNames.EDITOR_GROUPS_CONTAINER,
    type: VirtualDomElements.Div,
  })
})

test('getMainAreaVirtualDom should handle multiple groups', () => {
  const layout = {
    activeGroupId: 'group1',
    direction: 'horizontal' as const,
    groups: [
      {
        activeTabId: 'tab1',
        focused: false,
        id: 'group1',
        size: 50,
        tabs: [
          {
            content: 'content 1',
            editorType: 'text' as const,
            id: 'tab1',
            isDirty: false,
            title: 'File 1',
          },
        ],
      },
      {
        activeTabId: 'tab2',
        focused: false,
        id: 'group2',
        size: 50,
        tabs: [
          {
            content: 'content 2',
            editorType: 'text' as const,
            id: 'tab2',
            isDirty: true,
            title: 'File 2',
          },
        ],
      },
    ],
  }
  const result = getMainAreaVirtualDom(layout)
  
  expect(result.length).toBe(24) // 1 (Main) + 1 (EditorGroupsContainer) + 22 (2 * renderEditorGroup)
  expect(result[1].childCount).toBe(2)
})

test('getMainAreaVirtualDom should handle empty groups array', () => {
  const layout = {
    activeGroupId: undefined,
    direction: 'horizontal' as const,
    groups: [],
  }
  const result = getMainAreaVirtualDom(layout)
  
  expect(result.length).toBe(2) // 1 (Main) + 1 (EditorGroupsContainer)
  expect(result[1].childCount).toBe(0)
})
