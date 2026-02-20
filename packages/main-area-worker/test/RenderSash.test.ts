import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { renderSash } from '../src/parts/RenderSash/RenderSash.ts'

test('renderSash vertical', () => {
  const node = renderSash('vertical')
  expect(node.className).toBe('SashVertical')
  expect(node.type).toBe(VirtualDomElements.Div)
})

test('renderSash horizontal', () => {
  const node = renderSash('horizontal')
  expect(node.className).toBe('SashHorizontal')
  expect(node.type).toBe(VirtualDomElements.Div)
})
