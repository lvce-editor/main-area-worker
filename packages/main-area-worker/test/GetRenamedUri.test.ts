import { expect, test } from '@jest/globals'
import { getRenamedUri } from '../src/parts/GetRenamedUri/GetRenamedUri.ts'

test('getRenamedUri updates an exact file URI', () => {
  expect(getRenamedUri('/test/original.txt', '/test/original.txt', '/test/renamed.txt')).toBe('/test/renamed.txt')
})

test('getRenamedUri updates a file inside a renamed folder', () => {
  expect(getRenamedUri('/test/before/nested/file.txt', '/test/before', '/test/after')).toBe('/test/after/nested/file.txt')
})

test('getRenamedUri supports windows path separators', () => {
  expect(getRenamedUri('C:\\test\\before\\file.txt', 'C:\\test\\before', 'C:\\test\\after')).toBe('C:\\test\\after\\file.txt')
})

test('getRenamedUri preserves unrelated and missing URIs', () => {
  expect(getRenamedUri('/test/before-other/file.txt', '/test/before', '/test/after')).toBe('/test/before-other/file.txt')
  expect(getRenamedUri(undefined, '/test/before', '/test/after')).toBeUndefined()
})
