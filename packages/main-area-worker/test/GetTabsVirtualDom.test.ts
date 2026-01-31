import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { getTabsVirtualDom } from '../src/parts/GetTabsVirtualDom/GetTabsVirtualDom.ts'

test('getTabsVirtualDom should return correct structure with empty tabs', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    isEmpty: true,
    size: 50,
    tabs: [],
  }

  const result = getTabsVirtualDom(group, 0, 0)

  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    childCount: 0,
    className: 'MainTabs',
    role: 'tablist',
    type: VirtualDomElements.Div,
  })
})

test('getTabsVirtualDom should return correct structure with single tab', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Test File',
    uri: '/path/to/Test File',
  }

  const group: EditorGroup = {
    activeTabId: 1,
    focused: false,
    id: 1,
    isEmpty: false,
    size: 50,
    tabs: [tab],
  }

  const result = getTabsVirtualDom(group, 0, 1)

  expect(result).toHaveLength(7)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'MainTabs',
    role: 'tablist',
    type: VirtualDomElements.Div,
  })
})

test('getTabsVirtualDom should return correct structure with multiple tabs', () => {
  const tabs: Tab[] = [
    {
      editorType: 'text',
      editorUid: -1,
      icon: '',
      id: 1,
      isDirty: false,
      title: 'File 1',
      uri: '/path/to/file1',
    },
    {
      editorType: 'text',
      editorUid: -2,
      icon: '',
      id: 2,
      isDirty: true,
      title: 'File 2',
      uri: '/path/to/file2',
    },
    {
      editorType: 'text',
      editorUid: -3,
      icon: '',
      id: 3,
      isDirty: false,
      title: 'File 3',
      uri: '/path/to/file3',
    },
  ]

  const group: EditorGroup = {
    activeTabId: 2,
    focused: true,
    id: 1,
    size: 50,
    tabs,
    isEmpty: false,
  }

  const result = getTabsVirtualDom(group, 0, 3)

  // First element is the MainTabs container
  expect(result[0]).toEqual({
    childCount: 3,
    className: 'MainTabs',
    role: 'tablist',
    type: VirtualDomElements.Div,
  })

  // Rest should be rendered tabs
  // Each tab renders multiple elements (6 elements per tab typically)
  expect(result.length).toBeGreaterThan(1)
})

test('getTabsVirtualDom should correctly mark active tab', () => {
  const tabs: Tab[] = [
    {
      editorType: 'text',
      editorUid: -1,
      icon: '',
      id: 1,
      isDirty: false,
      title: 'File 1',
      uri: '/path/to/file1',
    },
    {
      editorType: 'text',
      editorUid: -2,
      icon: '',
      id: 2,
      isDirty: false,
      title: 'File 2',
      uri: '/path/to/file2',
    },
  ]

  const group: EditorGroup = {
    activeTabId: 2,
    focused: true,
    id: 1,
    size: 50,
    tabs,
    isEmpty: false,
  }

  const result = getTabsVirtualDom(group, 0, 2)

  // Find the tab elements (skip the container at index 0)
  // Tabs should have aria-selected attribute based on activeTabId
  const firstTabContainer = result[1]
  const secondTabContainer = result.find((el, idx) => idx > 1 && el && 'aria-selected' in el && el['data-index'] === 1)

  // First tab (id: 1) should not be active
  expect(firstTabContainer).toHaveProperty('aria-selected', false)

  // Second tab (id: 2) should be active
  expect(secondTabContainer).toHaveProperty('aria-selected', true)
})

test('getTabsVirtualDom should handle undefined activeTabId', () => {
  const tabs: Tab[] = [
    {
      editorType: 'text',
      editorUid: -1,
      icon: '',
      id: 1,
      isDirty: false,
      title: 'File 1',
      uri: '/path/to/file1',
    },
  ]

  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    size: 50,
    tabs,
    isEmpty: false,
  }

  const result = getTabsVirtualDom(group, 0, 1)

  // Should not throw and should return structure with tab element
  expect(result).toBeDefined()
  expect(result[0]).toHaveProperty('className', 'MainTabs')
})

test('getTabsVirtualDom should pass correct groupIndex to tabs', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: -1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Test File',
    uri: '/path/to/Test File',
  }

  const group: EditorGroup = {
    activeTabId: 1,
    focused: false,
    id: 1,
    isEmpty: false,
    size: 50,
    tabs: [tab],
  }

  const result = getTabsVirtualDom(group, 5, 1)

  // Find the tab element and verify it has the correct groupIndex
  const tabElement = result[1]
  expect(tabElement).toHaveProperty('data-groupIndex', 5)
})

test('getTabsVirtualDom should use provided tabsChildCount', () => {
  const tabs: Tab[] = [
    {
      editorType: 'text',
      editorUid: -1,
      icon: '',
      id: 1,
      isDirty: false,
      title: 'File 1',
      uri: '/path/to/file1',
    },
    {
      editorType: 'text',
      editorUid: -2,
      icon: '',
      id: 2,
      isDirty: false,
      title: 'File 2',
      uri: '/path/to/file2',
    },
  ]

  const group: EditorGroup = {
    activeTabId: 1,
    focused: false,
    id: 1,
    size: 50,
    tabs,
    isEmpty: false,
  }

  const result = getTabsVirtualDom(group, 0, 2)

  expect(result[0].childCount).toBe(2)
})
