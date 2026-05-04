import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderSash } from '../src/parts/RenderSash/RenderSash.ts'

test('renderSash vertical', () => {
  const nodes = renderSash(2, '1:2')
  const node = nodes[0]
  const border = nodes[1]
  expect(node.className).toBe('Sash SashHorizontal')
  expect(node['data-sashId']).toBe('1:2')
  expect(node.childCount).toBe(1)
  expect(node.onPointerDown).toBe(DomEventListenerFunctions.HandleSashPointerDown)
  expect(node.role).toBe('none')
  expect(node.type).toBe(VirtualDomElements.Button)
  expect(border.className).toBe('SashBorder SashBorderHorizontal')
  expect(border.childCount).toBe(0)
  expect(border.type).toBe(VirtualDomElements.Div)
})

test('renderSash horizontal', () => {
  const nodes = renderSash(1, '1:2')
  const node = nodes[0]
  const border = nodes[1]
  expect(node.className).toBe('Sash SashVertical')
  expect(node['data-sashId']).toBe('1:2')
  expect(node.childCount).toBe(1)
  expect(node.role).toBe('none')
  expect(node.type).toBe(VirtualDomElements.Button)
  expect(border.className).toBe('SashBorder SashBorderVertical')
  expect(border.childCount).toBe(0)
  expect(border.type).toBe(VirtualDomElements.Div)
})
