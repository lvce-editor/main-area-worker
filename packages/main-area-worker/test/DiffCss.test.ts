import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffCss/DiffCss.ts'

test('unchanged layout CSS inputs do not require another stylesheet command', () => {
  const state = createDefaultState()
  expect(isEqual(state, state)).toBe(true)
  expect(isEqual(state, { ...state, pointerDownGroupIndex: 2 })).toBe(true)
})

test('initial rendering and every CSS input still require stylesheet publication', () => {
  const state = createDefaultState()
  expect(isEqual({ ...state, initial: true }, state)).toBe(false)
  for (const changes of [
    { layout: { ...state.layout } },
    { width: state.width + 1 },
    { tabHeight: state.tabHeight + 1 },
    { dragOverlay: { groupId: 1, position: 'left' } as any },
  ]) {
    expect(isEqual(state, { ...state, ...changes })).toBe(false)
  }
})
