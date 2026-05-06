import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as RenderWaterMark from '../src/parts/RenderWaterMark/RenderWaterMark.ts'

test('renderWaterMark should return array with two elements', () => {
  const result = RenderWaterMark.renderWaterMark(1)

  expect(result).toHaveLength(2)
})

test('renderWaterMark should create WaterMarkWrapper div', () => {
  const result = RenderWaterMark.renderWaterMark(1)

  expect(result[0].type).toBe(VirtualDomElements.Div)
  expect(result[0].className).toBe('WaterMarkWrapper')
})

test('renderWaterMark should set data-groupId on wrapper', () => {
  const result = RenderWaterMark.renderWaterMark(5)

  expect(result[0]['data-groupId']).toBe('5')
})

test('renderWaterMark should create WaterMark div inside', () => {
  const result = RenderWaterMark.renderWaterMark(1)

  expect(result[1].type).toBe(VirtualDomElements.Div)
  expect(result[1].className).toBe('WaterMark')
})

test('renderWaterMark should set data-groupId on watermark element', () => {
  const result = RenderWaterMark.renderWaterMark(10)

  expect(result[1]['data-groupId']).toBe('10')
})

test('renderWaterMark should have correct childCount', () => {
  const result = RenderWaterMark.renderWaterMark(1)

  expect(result[0].childCount).toBe(1)
  expect(result[1].childCount).toBe(0)
})

test('renderWaterMark should handle different groupIds', () => {
  const result1 = RenderWaterMark.renderWaterMark(1)
  const result2 = RenderWaterMark.renderWaterMark(99)

  expect(result1[0]['data-groupId']).toBe('1')
  expect(result2[0]['data-groupId']).toBe('99')
})

test('renderWaterMark should return readonly array', () => {
  const result = RenderWaterMark.renderWaterMark(1)

  expect(Array.isArray(result)).toBe(true)
})
