import { expect, test } from '@jest/globals'
import * as EditorSplitDirection from '../src/parts/EditorSplitDirection/EditorSplitDirection.ts'
import { getSplitDirection } from '../src/parts/GetSplitDirection/GetSplitDirection.ts'

test('getSplitDirection should return left for the left quarter', () => {
  expect(getSplitDirection(199, 300, 800, 600)).toBe(EditorSplitDirection.Left)
})

test('getSplitDirection should return right for the right quarter', () => {
  expect(getSplitDirection(601, 300, 800, 600)).toBe(EditorSplitDirection.Right)
})

test('getSplitDirection should return up for the top quarter', () => {
  expect(getSplitDirection(400, 149, 800, 600)).toBe(EditorSplitDirection.Up)
})

test('getSplitDirection should return down for the bottom quarter', () => {
  expect(getSplitDirection(400, 451, 800, 600)).toBe(EditorSplitDirection.Down)
})

test('getSplitDirection should return none for the center', () => {
  expect(getSplitDirection(400, 300, 800, 600)).toBe(EditorSplitDirection.None)
})

test('getSplitDirection should include the quarter boundaries in the center', () => {
  expect(getSplitDirection(200, 150, 800, 600)).toBe(EditorSplitDirection.None)
  expect(getSplitDirection(600, 450, 800, 600)).toBe(EditorSplitDirection.None)
})
