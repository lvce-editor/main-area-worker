import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Refresh from '../src/parts/Refresh/Refresh.ts'

test('refresh should return a copy of the state', () => {
  const state: MainAreaState = { ...createDefaultState(), uid: 1 }
  const result = Refresh.refresh(state)
  expect(result).toEqual(state)
  expect(result).not.toBe(state)
})

test('refresh should preserve all state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    disposed: true,
    uid: 5,
  }
  const result = Refresh.refresh(state)
  expect(result.uid).toBe(5)
  expect(result.disposed).toBe(true)
})

test('refresh should not mutate original state', () => {
  const state: MainAreaState = { ...createDefaultState(), uid: 1 }
  const originalUid = state.uid
  Refresh.refresh(state)
  expect(state.uid).toBe(originalUid)
})
