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

test('getOverlay should preserve fractional dimensions for the top half', () => {
  expect(getOverlay(3, 7, 801, 601, EditorSplitDirection.Up)).toEqual({
    height: 300.5,
    width: 801,
    x: 3,
    y: 7,
  })
})

test('getOverlay should preserve fractional dimensions for the bottom half', () => {
  expect(getOverlay(3, 7, 801, 601, EditorSplitDirection.Down)).toEqual({
    height: 300.5,
    width: 801,
    x: 3,
    y: 307.5,
  })
})

test('getOverlay should preserve fractional dimensions for the left half', () => {
  expect(getOverlay(3, 7, 801, 601, EditorSplitDirection.Left)).toEqual({
    height: 601,
    width: 400.5,
    x: 3,
    y: 7,
  })
})

test('getOverlay should preserve fractional dimensions for the right half', () => {
  expect(getOverlay(3, 7, 801, 601, EditorSplitDirection.Right)).toEqual({
    height: 601,
    width: 400.5,
    x: 403.5,
    y: 7,
  })
})

test('getOverlay should preserve a zero-sized area', () => {
  expect(getOverlay(3, 7, 0, 0, EditorSplitDirection.None)).toEqual({
    height: 0,
    width: 0,
    x: 3,
    y: 7,
  })
})

test('getOverlay should offset the lower overlay from a negative origin', () => {
  expect(getOverlay(-20, -10, 200, 100, EditorSplitDirection.Down)).toEqual({
    height: 50,
    width: 200,
    x: -20,
    y: 40,
  })
})
