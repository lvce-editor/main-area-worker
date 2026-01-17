import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as Create from '../src/parts/Create/Create.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'

test('create should store state with the given uid', () => {
  const uid = 123
  Create.create(uid, '', 0, 0, 0, 0, 0, '')
  const result = MainAreaStates.get(uid)
  const { newState } = result
  const newStateTyped: MainAreaState = newState
  const { oldState } = result
  const oldStateTyped: MainAreaState = oldState
  expect(newStateTyped).toBeDefined()
  expect(newStateTyped.uid).toBe(uid)
  expect(oldStateTyped).toBeDefined()
  expect(oldStateTyped.uid).toBe(uid)
})
