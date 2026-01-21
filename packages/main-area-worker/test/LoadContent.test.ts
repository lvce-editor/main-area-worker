import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should mark first tab as active', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state)

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(6)
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[0].id)
  expect(result.layout.activeGroupId).toBe(0)
})

test('loadContent should create six default tabs', async () => {
  const state = createDefaultState()
  const result = await LoadContent.loadContent(state)

  const group = result.layout.groups[0]
  expect(group.tabs).toHaveLength(6)

  for (let i = 0; i < group.tabs.length; i++) {
    const tab = group.tabs[i]
    expect(tab.content).toBe('')
    expect(tab.editorType).toBe('text')
    expect(typeof tab.id).toBe('number')
    expect(tab.isDirty).toBe(false)
    expect(tab.title).toBe(`tab ${i + 1}`)
  }

  const ids = group.tabs.map((tab) => tab.id)
  const uniqueIds = new Set(ids)
  expect(uniqueIds.size).toBe(group.tabs.length)

  for (let i = 1; i < ids.length; i++) {
    expect(ids[i]).toBe(ids[i - 1] + 1)
  }
})

test('loadContent should preserve existing state properties', async () => {
  const state = {
    ...createDefaultState(),
    assetDir: '/test/assets',
    disposed: true,
    platform: 1,
    uid: 123,
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

  const firstTabId = result.layout.groups[0].tabs[0].id
  expect(result.layout).toEqual({
    activeGroupId: 0,
    direction: 'horizontal',
    groups: [
      {
        activeTabId: firstTabId,
        direction: 'horizontal',
        focused: false,
        id: 0,
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
