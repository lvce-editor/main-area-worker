import { expect, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import * as GetMenuIds from '../src/parts/GetMenuIds/GetMenuIds.ts'

test('getMenuIds - should return array containing Tab menu entry id', () => {
  const result = GetMenuIds.getMenuIds()
  expect(result).toEqual([MenuEntryId.Tab])
})

test('getMenuIds - should return read-only array', () => {
  const result = GetMenuIds.getMenuIds()
  expect(Object.isFrozen(result) || Array.isArray(result)).toBe(true)
})

test('getMenuIds - should return same menu ids on multiple calls', () => {
  const result1 = GetMenuIds.getMenuIds()
  const result2 = GetMenuIds.getMenuIds()
  expect(result1).toEqual(result2)
})
