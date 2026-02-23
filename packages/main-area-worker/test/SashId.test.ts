import { expect, test } from '@jest/globals'
import * as SashId from '../src/parts/SashId/SashId.ts'

test('create should return sash id in before:after format', () => {
  const result = SashId.create(1, 2)
  expect(result).toBe('1:2')
})

test('parse should parse valid sash id', () => {
  const result = SashId.parse('1:2')
  expect(result).toEqual({
    afterGroupId: 2,
    beforeGroupId: 1,
  })
})

test('parse should return undefined for empty string', () => {
  const result = SashId.parse('')
  expect(result).toBe(undefined)
})

test('parse should return undefined when before group id is missing', () => {
  const result = SashId.parse(':2')
  expect(result).toBe(undefined)
})

test('parse should return undefined when after group id is missing', () => {
  const result = SashId.parse('1:')
  expect(result).toBe(undefined)
})

test('parse should return undefined for non-numeric before group id', () => {
  const result = SashId.parse('abc:2')
  expect(result).toBe(undefined)
})

test('parse should return undefined for non-numeric after group id', () => {
  const result = SashId.parse('1:abc')
  expect(result).toBe(undefined)
})

test('parse should return undefined for infinity values', () => {
  const result = SashId.parse('Infinity:2')
  expect(result).toBe(undefined)
})
