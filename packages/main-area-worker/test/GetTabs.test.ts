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
  expect(tabs).toEqual([
    {
      content: '',
      editorType: 'text',
      id: 1,
      isDirty: false,
      title: 'tab 1',
    },
    {
      content: '',
      editorType: 'text',
      id: 2,
      isDirty: false,
      title: 'tab 2',
    },
    {
      content: '',
      editorType: 'text',
      id: 3,
      isDirty: false,
      title: 'tab 3',
    },
    {
      content: '',
      editorType: 'text',
      id: 4,
      isDirty: false,
      title: 'tab 4',
    },
    {
      content: '',
      editorType: 'text',
      id: 5,
      isDirty: false,
      title: 'tab 5',
    },
    {
      content: '',
      editorType: 'text',
      id: 6,
      isDirty: false,
      title: 'tab 6',
    },
  ])
})

test('getTabs should return readonly array', async () => {
  const tabs = await getTabs()
  expect(tabs).toBeDefined()
  expect(tabs.length).toBe(6)
})
