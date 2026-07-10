import { expect, test } from '@jest/globals'
import { getMinGroupSizePercent } from '../src/parts/GetMinGroupSizePercent/GetMinGroupSizePercent.ts'

test('getMinGroupSizePercent should convert the pixel minimum to a percentage', () => {
  expect(getMinGroupSizePercent(1000, 80)).toBe(8)
})

test('getMinGroupSizePercent should return zero when the axis size is zero', () => {
  expect(getMinGroupSizePercent(0, 80)).toBe(0)
})
