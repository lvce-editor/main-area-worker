import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { toggleSplitButton } from '../src/parts/ToggleSplitButton/ToggleSplitButton.ts'

test('toggleSplitButton should set splitButtonEnabled to true', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    splitButtonEnabled: false,
  }

  const result = toggleSplitButton(state, true)

  expect(result.splitButtonEnabled).toBe(true)
})

test('toggleSplitButton should set splitButtonEnabled to false', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    splitButtonEnabled: true,
  }

  const result = toggleSplitButton(state, false)

  expect(result.splitButtonEnabled).toBe(false)
})

test('toggleSplitButton should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 600,
    splitButtonEnabled: false,
    uid: 123,
    width: 800,
  }

  const result = toggleSplitButton(state, true)

  expect(result.uid).toBe(123)
  expect(result.width).toBe(800)
  expect(result.height).toBe(600)
  expect(result.splitButtonEnabled).toBe(true)
})

test('toggleSplitButton should not mutate original state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    splitButtonEnabled: false,
  }

  toggleSplitButton(state, true)

  expect(state.splitButtonEnabled).toBe(false)
})

test('toggleSplitButton should enable split button multiple times', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    splitButtonEnabled: false,
  }

  let result = toggleSplitButton(state, true)
  expect(result.splitButtonEnabled).toBe(true)

  result = toggleSplitButton(result, false)
  expect(result.splitButtonEnabled).toBe(false)

  result = toggleSplitButton(result, true)
  expect(result.splitButtonEnabled).toBe(true)
})
