import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleResize } from '../src/parts/HandleResize/HandleResize.ts'

test('handleResize should update x, y, width, and height', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const result = handleResize(state, 10, 20, 800, 600)

  expect(result.x).toBe(10)
  expect(result.y).toBe(20)
  expect(result.width).toBe(800)
  expect(result.height).toBe(600)
  expect(result.uid).toBe(1)
})

test('handleResize should preserve other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/assets',
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 2,
    tabHeight: 40,
    uid: 123,
  }

  const result = handleResize(state, 0, 0, 1024, 768)

  expect(result.assetDir).toBe('/assets')
  expect(result.platform).toBe(2)
  expect(result.tabHeight).toBe(40)
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.direction).toBe('horizontal')
})

test('handleResize should not mutate original state', () => {
  const state: MainAreaState = { ...createDefaultState(), uid: 1 }
  const originalX = state.x
  const originalY = state.y
  const originalWidth = state.width
  const originalHeight = state.height

  handleResize(state, 50, 100, 400, 300)

  expect(state.x).toBe(originalX)
  expect(state.y).toBe(originalY)
  expect(state.width).toBe(originalWidth)
  expect(state.height).toBe(originalHeight)
})

test('handleResize should handle zero values', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }

  const result = handleResize(state, 0, 0, 0, 0)

  expect(result.x).toBe(0)
  expect(result.y).toBe(0)
  expect(result.width).toBe(0)
  expect(result.height).toBe(0)
})
