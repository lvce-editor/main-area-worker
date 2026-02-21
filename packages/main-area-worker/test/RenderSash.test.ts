import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderSash } from '../src/parts/RenderSash/RenderSash.ts'

test('renderSash vertical', () => {
  const node = renderSash('vertical', '1:2', 'top:50%;')[0]
  expect(node.className).toBe('Sash SashHorizontal')
  expect(node['data-sashId']).toBe('1:2')
  expect(node.onPointerDown).toBe(DomEventListenerFunctions.HandleSashPointerDown)
  expect(node.onPointerMove).toBe(DomEventListenerFunctions.HandleSashPointerMove)
  expect(node.onPointerUp).toBe(DomEventListenerFunctions.HandleSashPointerUp)
  expect(node.style).toBe('top:50%;')
  expect(node.type).toBe(VirtualDomElements.Div)
})

test('renderSash horizontal', () => {
  const node = renderSash('horizontal', '1:2', 'left:50%;')[0]
  expect(node.className).toBe('Sash SashVertical')
  expect(node['data-sashId']).toBe('1:2')
  expect(node.style).toBe('left:50%;')
  expect(node.type).toBe(VirtualDomElements.Div)
})
