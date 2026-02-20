import { expect, test } from '@jest/globals'
import { renderSash } from '../src/parts/RenderSash/RenderSash.ts'

test('renderSash vertical', () => {
  const node = renderSash('vertical', 0)
  expect(node.className).toBe('SashVertical')
  expect(node.type).toBe('Div')
  expect(node['data-group-index']).toBe(0)
})

test('renderSash horizontal', () => {
  const node = renderSash('horizontal', 1)
  expect(node.className).toBe('SashHorizontal')
  expect(node.type).toBe('Div')
  expect(node['data-group-index']).toBe(1)
})
