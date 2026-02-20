import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return array with HandleClick event listener', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toBeDefined()
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashPointerDown)).toBe(true)
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashPointerMove)).toBe(true)
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashPointerUp)).toBe(true)
})
