import { expect, test } from '@jest/globals'
import { getTabs } from '../src/parts/GetTabs/GetTabs.ts'

test('getTabs should return an array', async () => {
  const tabs = await getTabs()
  expect(Array.isArray(tabs)).toBe(true)
})

test('getTabs should return six tabs', async () => {
  const tabs = await getTabs()
  expect(tabs).toHaveLength(6)
})

test('getTabs should return tabs with correct structure', async () => {
  const tabs = await getTabs()

  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i]
    expect(tab.content).toBe('')
    expect(tab.editorType).toBe('text')
    expect(typeof tab.id).toBe('number')
    expect(tab.isDirty).toBe(false)
    expect(tab.title).toBe(`tab ${i + 1}`)
  }
})

test('getTabs should return tabs with unique incrementing ids', async () => {
  const tabs = await getTabs()
  const ids = tabs.map((tab) => tab.id)
  const editorUids = tabs.map((tab) => tab.editorUid)
  const uniqueIds = new Set(ids)
  const uniqueEditorUids = new Set(editorUids)

  expect(uniqueIds.size).toBe(tabs.length)
  expect(uniqueEditorUids.size).toBe(tabs.length)

  // IDs should be unique and incrementing (though not necessarily by 1)
  for (let i = 1; i < ids.length; i++) {
    expect(ids[i]).toBeGreaterThan(ids[i - 1])
  }
  
  // editorUids should also be unique and incrementing
  for (let i = 1; i < editorUids.length; i++) {
    expect(editorUids[i]).toBeGreaterThan(editorUids[i - 1])
  }
})

test('getTabs should return readonly array', async () => {
  const tabs = await getTabs()
  expect(tabs).toBeDefined()
  expect(tabs.length).toBe(6)
})
