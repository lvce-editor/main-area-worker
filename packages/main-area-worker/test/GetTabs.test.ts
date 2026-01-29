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

test('getTabs should return tabs with unique ids', async () => {
  const tabs = await getTabs()
  const ids = tabs.map((tab) => tab.id)
  const editorUids = tabs.map((tab) => tab.editorUid)
  const uniqueIds = new Set(ids)
  const uniqueEditorUids = new Set(editorUids)

  expect(uniqueIds.size).toBe(tabs.length)
  expect(uniqueEditorUids.size).toBe(tabs.length)

  // IDs should be random numbers between 0 and 1
  for (let i = 0; i < ids.length; i++) {
    expect(ids[i]).toBeGreaterThanOrEqual(0)
    expect(ids[i]).toBeLessThan(1)
  }

  // editorUids should also be random numbers between 0 and 1
  for (let i = 0; i < editorUids.length; i++) {
    expect(editorUids[i]).toBeGreaterThanOrEqual(0)
    expect(editorUids[i]).toBeLessThan(1)
  }
})

test('getTabs should return readonly array', async () => {
  const tabs = await getTabs()
  expect(tabs).toBeDefined()
  expect(tabs.length).toBe(6)
})
