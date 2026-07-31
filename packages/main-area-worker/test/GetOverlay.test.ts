import { expect, test } from '@jest/globals'
import * as EditorSplitDirection from '../src/parts/EditorSplitDirection/EditorSplitDirection.ts'
import { getOverlay } from '../src/parts/GetOverlay/GetOverlay.ts'

test('getOverlay should cover the full area when there is no split', () => {
  expect(getOverlay(10, 20, 800, 600, EditorSplitDirection.None)).toEqual({
    height: 600,
    width: 800,
    x: 10,
    y: 20,
  })
})

test('getOverlay should cover the top half', () => {
  expect(getOverlay(10, 20, 800, 600, EditorSplitDirection.Up)).toEqual({
    height: 300,
    width: 800,
    x: 10,
    y: 20,
  })
})

test('getOverlay should cover the bottom half', () => {
  expect(getOverlay(10, 20, 800, 600, EditorSplitDirection.Down)).toEqual({
    height: 300,
    width: 800,
    x: 10,
    y: 320,
  })
})

test('getOverlay should cover the left half', () => {
  expect(getOverlay(10, 20, 800, 600, EditorSplitDirection.Left)).toEqual({
    height: 600,
    width: 400,
    x: 10,
    y: 20,
  })
})

test('getOverlay should cover the right half', () => {
  expect(getOverlay(10, 20, 800, 600, EditorSplitDirection.Right)).toEqual({
    height: 600,
    width: 400,
    x: 410,
    y: 20,
  })
})
