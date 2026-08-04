import { expect, test } from '@jest/globals'
import * as TryRestoreLayout from '../src/parts/TryRestoreLayout/TryRestoreLayout.ts'

test('tryRestoreLayout should return undefined when savedState is undefined', () => {
  const result = TryRestoreLayout.tryRestoreLayout(undefined)

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should return undefined when savedState is null', () => {
  const result = TryRestoreLayout.tryRestoreLayout(null)

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should return undefined when savedState is not an object', () => {
  const result = TryRestoreLayout.tryRestoreLayout('string')

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should return undefined when layout is missing', () => {
  const result = TryRestoreLayout.tryRestoreLayout({})

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should return undefined when layout is null', () => {
  const result = TryRestoreLayout.tryRestoreLayout({ layout: null })

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should return undefined when layout is not an object', () => {
  const result = TryRestoreLayout.tryRestoreLayout({ layout: 'string' })

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should return undefined when groups is not an array', () => {
  const result = TryRestoreLayout.tryRestoreLayout({ layout: { groups: 'not-array' } })

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should return undefined when direction is invalid', () => {
  const result = TryRestoreLayout.tryRestoreLayout({
    layout: {
      direction: 999,
      groups: [],
    },
  })

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should restore a legacy layout with empty groups', () => {
  const result = TryRestoreLayout.tryRestoreLayout({
    layout: {
      direction: 1,
      groups: [],
    },
  })

  expect(result).toBeDefined()
  expect(result?.activeGroupId).toBe(-1)
  expect(result?.groups).toHaveLength(0)
})

test('tryRestoreLayout should restore layout with horizontal direction', () => {
  const result = TryRestoreLayout.tryRestoreLayout({
    layout: {
      direction: 1,
      groups: [],
    },
  })

  expect(result).toBeDefined()
  expect(result?.direction).toBe(1)
})

test('tryRestoreLayout should restore layout with vertical direction', () => {
  const result = TryRestoreLayout.tryRestoreLayout({
    layout: {
      direction: 2,
      groups: [],
    },
  })

  expect(result).toBeDefined()
  expect(result?.direction).toBe(2)
})

test('tryRestoreLayout should handle multiple groups', () => {
  const result = TryRestoreLayout.tryRestoreLayout({
    layout: {
      direction: 1,
      groups: [
        {
          focused: true,
          id: 1,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: -1,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
  })

  expect(result).toBeDefined()
  expect(result?.groups).toHaveLength(2)
  expect(result?.groups[0].activeTabId).toBe(-1)
  expect(result?.groups.map((group) => group.direction)).toEqual([1, 1])
})

test('tryRestoreLayout should reject an invalid explicit group direction', () => {
  const result = TryRestoreLayout.tryRestoreLayout({
    layout: {
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 999,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  })

  expect(result).toBeUndefined()
})

test('tryRestoreLayout should normalize group directions', () => {
  const result = TryRestoreLayout.tryRestoreLayout({
    layout: {
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 2,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  })

  expect(result?.groups[0].direction).toBe(2)
})
