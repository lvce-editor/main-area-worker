import { expect, test } from '@jest/globals'
import { parseRawGroupId } from '../src/parts/ParseRawGroupId/ParseRawGroupId.ts'

test('parseRawGroupId should parse valid group id', () => {
  const result = parseRawGroupId('2')
  expect(result).toBe(2)
})

test('parseRawGroupId should parse decimal group id', () => {
  const result = parseRawGroupId('2.5')
  expect(result).toBe(2.5)
})

test('parseRawGroupId should return undefined when raw group id is missing', () => {
  const result = parseRawGroupId(undefined)
  expect(result).toBe(undefined)
})

test('parseRawGroupId should return undefined when raw group id is invalid', () => {
  const result = parseRawGroupId('invalid')
  expect(result).toBe(undefined)
})
