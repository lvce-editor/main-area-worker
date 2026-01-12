import { expect, test } from '@jest/globals'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'

test('handleClick should return state unchanged', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'test-item')
  expect(result).toEqual(state)
})

test.skip('handleClick should return state with items unchanged', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'test.command',
        elements: [
          { type: 'icon' as const, value: 'test-icon' },
          { type: 'text' as const, value: 'Test' },
        ],
        name: 'test-item',
        tooltip: 'Test tooltip',
      },
    ],
    statusBarItemsRight: [],
  }
  const result = await HandleClick.handleClick(state, 'test-item')
  expect(result).toEqual(state)
})

test('handleClick should return state with disposed flag unchanged', async () => {
  const state: StatusBarState & { disposed?: boolean } = {
    ...createDefaultState(),
    disposed: true,
  }
  const result = await HandleClick.handleClick(state, 'test-item')
  expect(result).toEqual(state)
  expect((result as any).disposed).toBe(true)
})

test.skip('handleClick should return state with different name', async () => {
  const state: StatusBarState = {
    ...createDefaultState(),
    statusBarItemsLeft: [
      {
        command: 'command1',
        elements: [
          { type: 'icon' as const, value: 'icon1' },
          { type: 'text' as const, value: 'Item 1' },
        ],
        name: 'item1',
        tooltip: 'Tooltip 1',
      },
      {
        command: 'command2',
        elements: [
          { type: 'icon' as const, value: 'icon2' },
          { type: 'text' as const, value: 'Item 2' },
        ],
        name: 'item2',
        tooltip: 'Tooltip 2',
      },
    ],
    statusBarItemsRight: [
      {
        command: 'command3',
        elements: [
          { type: 'icon' as const, value: 'icon3' },
          { type: 'text' as const, value: 'Item 3' },
        ],
        name: 'item3',
        tooltip: 'Tooltip 3',
      },
    ],
  }
  const result = await HandleClick.handleClick(state, 'item2')
  expect(result).toEqual(state)
})

test('handleClick should return state with empty name', async () => {
  const state: StatusBarState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toEqual(state)
})
