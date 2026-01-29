import { expect, test } from '@jest/globals'
import * as Id from '../src/parts/Id/Id.ts'

test('create should return random numbers between 0 and 1', () => {
  const id1 = Id.create()
  const id2 = Id.create()
  const id3 = Id.create()

  expect(id1).toBeGreaterThanOrEqual(0)
  expect(id1).toBeLessThan(1)
  expect(id2).toBeGreaterThanOrEqual(0)
  expect(id2).toBeLessThan(1)
  expect(id3).toBeGreaterThanOrEqual(0)
  expect(id3).toBeLessThan(1)
  // Random IDs should be different with very high probability
  expect(id1).not.toBe(id2)
  expect(id2).not.toBe(id3)
})
