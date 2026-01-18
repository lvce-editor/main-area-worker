import { expect, test } from '@jest/globals'
import { VirtualDomElements, AriaRoles, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetStatusBarItemsVirtualDom from '../src/parts/GetStatusBarItemsVirtualDom/GetStatusBarItemsVirtualDom.ts'

test('getStatusBarItemsVirtualDom should return container div with empty array', () => {
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom([], 'test-class')
  expect(result).toEqual([])
})

test('getStatusBarItemsVirtualDom should return container div with single item', () => {
  const items = [
    {
      elements: [{ type: 'text' as const, value: 'Test Item' }],
      name: 'test.item',
      tooltip: 'Test Tooltip',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'test-class')
  expect(result).toEqual([
    {
      childCount: 1,
      className: 'test-class',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.StatusBarItem,
      name: 'test.item',
      role: AriaRoles.Button,
      tabIndex: -1,
      title: 'Test Tooltip',
      type: VirtualDomElements.Button,
    },
    text('Test Item'),
  ])
})

test('getStatusBarItemsVirtualDom should return container div with multiple items', () => {
  const items = [
    {
      elements: [{ type: 'text' as const, value: 'Item 1' }],
      name: 'item1',
      tooltip: 'Tooltip 1',
    },
    {
      elements: [{ type: 'text' as const, value: 'Item 2' }],
      name: 'item2',
      tooltip: 'Tooltip 2',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'test-class')
  expect(result).toEqual([
    {
      childCount: 2,
      className: 'test-class',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.StatusBarItem,
      name: 'item1',
      role: AriaRoles.Button,
      tabIndex: -1,
      title: 'Tooltip 1',
      type: VirtualDomElements.Button,
    },
    text('Item 1'),
    {
      childCount: 1,
      className: ClassNames.StatusBarItem,
      name: 'item2',
      role: AriaRoles.Button,
      tabIndex: -1,
      title: 'Tooltip 2',
      type: VirtualDomElements.Button,
    },
    text('Item 2'),
  ])
})

test('getStatusBarItemsVirtualDom should use provided className', () => {
  const items = [
    {
      elements: [{ type: 'text' as const, value: 'Test Item' }],
      name: 'test.item',
      tooltip: 'Test Tooltip',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'custom-class-name')
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'custom-class-name',
    type: VirtualDomElements.Div,
  })
})

test('getStatusBarItemsVirtualDom should handle items with all fields', () => {
  const items = [
    {
      command: 'test.command',
      elements: [
        { type: 'icon' as const, value: 'test-icon' },
        { type: 'text' as const, value: 'Test Item' },
      ],
      name: 'test.item',
      tooltip: 'Test Tooltip',
    },
  ]
  const result = GetStatusBarItemsVirtualDom.getStatusBarItemsVirtualDom(items, 'test-class')
  expect(result).toEqual([
    {
      childCount: 1,
      className: 'test-class',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: ClassNames.StatusBarItem,
      name: 'test.item',
      role: AriaRoles.Button,
      tabIndex: -1,
      title: 'Test Tooltip',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'test-icon',
      type: VirtualDomElements.Div,
    },
    text('Test Item'),
  ])
})
