import { expect, test } from '@jest/globals'
import type { EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import { normalizeGroupSizes } from '../src/parts/NormalizeGroupSizes/NormalizeGroupSizes.ts'

test('normalizeGroupSizes should normalize sizes to percentages', () => {
  const groups: readonly EditorGroup[] = [
    {
      activeTabId: undefined,
      focused: true,
      id: 1,
      size: 30,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
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
      activeTabId: undefined,
      focused: true,
      id: 1,
      size: 20,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
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
      activeTabId: undefined,
      focused: true,
      id: 1,
      size: 0,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
      size: 0,
      tabs: [],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 3,
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
      focused: true,
      id: 1,
      size: 50,
      tabs: [
        {
          content: 'content',
          editorType: 'text',
          id: 1,
          isDirty: false,
          title: 'File',
        },
      ],
    },
    {
      activeTabId: undefined,
      focused: false,
      id: 2,
      size: 50,
      tabs: [],
    },
  ]
  const result = normalizeGroupSizes(groups)
  expect(result[0].id).toBe(1)
  expect(result[0].focused).toBe(true)
  expect(result[0].activeTabId).toBe(1)
  expect(result[0].tabs).toHaveLength(1)
  expect(result[1].id).toBe(2)
  expect(result[1].focused).toBe(false)
})
