import { expect, test } from '@jest/globals'
import * as Id from '../src/parts/Id/Id.ts'

test('create should return incrementing numbers', () => {
  const id1 = Id.create()
  const id2 = Id.create()
  const id3 = Id.create()

  expect(id2).toBe(id1 + 1)
  expect(id3).toBe(id2 + 1)
})

test('setMinId should update counter when minId is greater', () => {
  Id.create()
  Id.setMinId(1000)
  const nextId = Id.create()

  expect(nextId).toBe(1001)
})

test('setMinId should not update counter when minId is smaller', () => {
  Id.setMinId(2000)
  const id1 = Id.create()
  Id.setMinId(100)
  const id2 = Id.create()

  expect(id1).toBe(2001)
  expect(id2).toBe(2002)
})
