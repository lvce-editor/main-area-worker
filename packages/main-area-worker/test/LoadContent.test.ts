import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should mark first tab as active', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state)

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(2)
  expect(result.layout.groups[0].activeTabId).toBe('1')
  expect(result.layout.activeGroupId).toBe('0')
})

test('loadContent should create two default tabs', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state)

  const group = result.layout.groups[0]
  expect(group.tabs).toEqual([
    {
      content: '',
      editorType: 'text',
      id: '1',
      isDirty: false,
      title: 'tab 1',
    },
    {
      content: '',
      editorType: 'text',
      id: '2',
      isDirty: false,
      title: 'tab 2',
    },
  ])
})

test('loadContent should preserve existing state properties', async () => {
  const state = {
    ...createDefaultState(),
    disposed: true,
    uid: 123,
    assetDir: '/test/assets',
    platform: 1,
  }
  const result = await LoadContent.loadContent(state)

  expect(result.uid).toBe(123)
  expect(result.disposed).toBe(true)
  expect(result.assetDir).toBe('/test/assets')
  expect(result.platform).toBe(1)
})

test('loadContent should set correct layout structure', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state)

  expect(result.layout).toEqual({
    activeGroupId: '0',
    direction: 'horizontal',
    groups: [
      {
        activeTabId: '1',
        direction: 'horizontal',
        focused: false,
        id: '0',
        size: 300,
        tabs: expect.any(Array),
      },
    ],
  })
})

test('loadContent should handle empty state', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state)

  expect(result).toBeDefined()
  expect(result.layout).toBeDefined()
  expect(result.layout.groups).toBeDefined()
  expect(result.layout.groups[0].tabs).toBeDefined()
})
