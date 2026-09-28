import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import { normalizeGroupSizes } from '../src/parts/NormalizeGroupSizes/NormalizeGroupSizes.ts'

test('normalizeGroupSizes should normalize sizes to percentages', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: -1,
      direction: 1,
      id: 1,
      isEmpty: true,
      isFocused: true,
      size: 30,
      tabs: [],
    },
    {
      activeTabId: -1,
      direction: 1,
      id: 2,
      isEmpty: true,
      isFocused: false,
      size: 70,
      tabs: [],
    },
  ]
  const result = normalizeGroupSizes(groups)
  expect(result[0].size).toBe(30)
  expect(result[1].size).toBe(70)
})

test('normalizeGroupSizes should normalize when total is not 100', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: -1,
      direction: 1,
      id: 1,
      isEmpty: true,
      isFocused: true,
      size: 20,
      tabs: [],
    },
    {
      activeTabId: -1,
      direction: 1,
      id: 2,
      isEmpty: true,
      isFocused: false,
      size: 30,
      tabs: [],
    },
  ]
  const result = normalizeGroupSizes(groups)
  expect(result[0].size).toBe(40)
  expect(result[1].size).toBe(60)
})

test('normalizeGroupSizes should handle zero total by distributing equally', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: -1,
      direction: 1,
      id: 1,
      isEmpty: true,
      isFocused: true,
      size: 0,
      tabs: [],
    },
    {
      activeTabId: -1,
      direction: 1,
      id: 2,
      isEmpty: true,
      isFocused: false,
      size: 0,
      tabs: [],
    },
    {
      activeTabId: -1,
      direction: 1,
      id: 3,
      isEmpty: true,
      isFocused: false,
      size: 0,
      tabs: [],
    },
  ]
  const result = normalizeGroupSizes(groups)
  const total = result[0].size + result[1].size + result[2].size
  expect(total).toBeGreaterThanOrEqual(99)
  expect(total).toBeLessThanOrEqual(100)
  expect(result[0].size).toBeGreaterThanOrEqual(33)
  expect(result[1].size).toBeGreaterThanOrEqual(33)
  expect(result[2].size).toBeGreaterThanOrEqual(33)
})

test('normalizeGroupSizes should preserve other group properties', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: 1,
      direction: 1,
      id: 1,
      isEmpty: false,
      isFocused: true,
      size: 50,
      tabs: [
        {
          editorUid: -1,
          icon: '',
          id: 1,
          isDirty: false,
          isPreview: false,
          title: 'File',
        },
      ],
    },
    {
      activeTabId: -1,
      direction: 1,
      id: 2,
      isEmpty: true,
      isFocused: false,
      size: 50,
      tabs: [],
    },
  ]
  const result = normalizeGroupSizes(groups)
  expect(result[0].id).toBe(1)
  expect(result[0].isFocused).toBe(true)
  expect(result[0].activeTabId).toBe(1)
  expect(result[0].tabs).toHaveLength(1)
  expect(result[1].id).toBe(2)
  expect(result[1].isFocused).toBe(false)
})
