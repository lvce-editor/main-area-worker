import { expect, test } from '@jest/globals'
import { EventExpression } from '@lvce-editor/constants'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return array with HandleClick event listener', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toBeDefined()
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashPointerDown)).toBe(true)
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashPointerMove)).toBe(true)
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashPointerUp)).toBe(true)
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashCornerPointerDown)).toBe(true)
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashCornerPointerMove)).toBe(true)
  expect(result.some((listener) => listener.name === DomEventListenerFunctions.HandleSashCornerPointerUp)).toBe(true)
})

test('renderEventListeners should pass the mouse button to the tab click handler', () => {
  const result = RenderEventListeners.renderEventListeners()
  const listener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleClickTab)

  expect(listener?.params).toEqual(['handleClickTab', 'event.target.dataset.groupIndex', 'event.target.dataset.index', EventExpression.Button])
})

test('renderEventListeners should pass tab indices to the double click handler', () => {
  const result = RenderEventListeners.renderEventListeners()
  const listener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDoubleClick)

  expect(listener?.params).toEqual(['handleDoubleClick', 'event.target.dataset.groupIndex', 'event.target.dataset.index'])
})

test('renderEventListeners should register drag event listeners', () => {
  const result = RenderEventListeners.renderEventListeners()
  const dragOver = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDragOver)
  const dragLeave = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDragLeave)
  const drop = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDrop)

  expect(dragOver).toEqual({
    name: DomEventListenerFunctions.HandleDragOver,
    params: ['handleDragOver', EventExpression.ClientX, EventExpression.ClientY],
    preventDefault: true,
  })
  expect(dragLeave).toEqual({
    name: DomEventListenerFunctions.HandleDragLeave,
    params: ['handleDragLeave'],
  })
  expect(drop).toEqual({
    name: DomEventListenerFunctions.HandleDrop,
    params: ['handleDragLeave'],
    preventDefault: true,
  })
})
