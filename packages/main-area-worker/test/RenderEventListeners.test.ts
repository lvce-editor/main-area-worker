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

  expect(listener?.params).toEqual([
    'handleClickTab',
    'event.currentTarget.dataset.groupIndex',
    'event.currentTarget.dataset.index',
    EventExpression.Button,
  ])
})

test('renderEventListeners should read close button indices from the current target', () => {
  const result = RenderEventListeners.renderEventListeners()
  const listener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleClickClose)

  expect(listener).toEqual({
    name: DomEventListenerFunctions.HandleClickClose,
    params: ['handleClickCloseTab', 'event.currentTarget.dataset.groupIndex', 'event.currentTarget.dataset.index'],
    stopPropagation: true,
  })
})

test('renderEventListeners should pass the current tab and key to the tab keydown handler', () => {
  const result = RenderEventListeners.renderEventListeners()
  const listener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleTabKeyDown)

  expect(listener?.params).toEqual([
    'handleTabKeyDown',
    'event.currentTarget.dataset.groupIndex',
    'event.currentTarget.dataset.index',
    EventExpression.Key,
  ])
  expect(listener?.preventDefault).toBeUndefined()
})

test('renderEventListeners should pass vertical wheel input to the tab strip', () => {
  const result = RenderEventListeners.renderEventListeners()
  const listener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleTabsWheel)

  expect(listener?.params).toEqual(['handleTabsWheel', 'event.currentTarget.dataset.groupIndex', EventExpression.DeltaMode, EventExpression.DeltaY])
  expect(listener?.preventDefault).toBeUndefined()
})

test('renderEventListeners should pass tab indices to the double click handler', () => {
  const result = RenderEventListeners.renderEventListeners()
  const listener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDoubleClick)

  expect(listener?.params).toEqual(['handleDoubleClick', 'event.target.dataset.groupIndex', 'event.target.dataset.index'])
})

test('renderEventListeners should pass tab indices to the context menu handler', () => {
  const result = RenderEventListeners.renderEventListeners()
  const listener = result.find((listener) => listener.name === DomEventListenerFunctions.HandleTabContextMenu)

  expect(listener?.params).toEqual([
    'handleTabContextMenu',
    EventExpression.Button,
    EventExpression.ClientX,
    EventExpression.ClientY,
    'event.target.dataset.groupIndex',
    'event.target.dataset.index',
  ])
})

test('renderEventListeners should register drag event listeners', () => {
  const result = RenderEventListeners.renderEventListeners()
  const dragOver = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDragOver)
  const dragLeave = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDragLeave)
  const drop = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDrop)
  const dragStart = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDragStart)
  const dragEnd = result.find((listener) => listener.name === DomEventListenerFunctions.HandleDragEnd)
  const mouseUp = result.find((listener) => listener.name === DomEventListenerFunctions.HandleTabMouseUp)
  const tabDragOver = result.find((listener) => listener.name === DomEventListenerFunctions.HandleTabDragOver)
  const tabsDragOver = result.find((listener) => listener.name === DomEventListenerFunctions.HandleTabsDragOver)

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
    params: ['handleDrop', EventExpression.DropId],
    preventDefault: true,
  })
  expect(dragStart).toEqual({
    dragEffect: 'copyMove',
    name: DomEventListenerFunctions.HandleDragStart,
    params: ['handleDragStart'],
  })
  expect(dragEnd).toEqual({
    name: DomEventListenerFunctions.HandleDragEnd,
    params: ['handleDragEnd'],
  })
  expect(mouseUp).toEqual({
    name: DomEventListenerFunctions.HandleTabMouseUp,
    params: ['handleTabMouseUp'],
  })
  expect(tabDragOver).toEqual({
    name: DomEventListenerFunctions.HandleTabDragOver,
    params: [
      'handleTabDragOver',
      'event.currentTarget.dataset.groupIndex',
      'event.currentTarget.dataset.index',
      'event.currentTarget.offsetLeft',
      'event.currentTarget.offsetWidth',
      'event.currentTarget.parentElement.scrollLeft',
      EventExpression.ClientX,
      EventExpression.ClientY,
    ],
    preventDefault: true,
    stopPropagation: true,
  })
  expect(tabsDragOver).toEqual({
    name: DomEventListenerFunctions.HandleTabsDragOver,
    params: ['handleTabsDragOver', 'event.currentTarget.dataset.groupIndex', EventExpression.ClientX, EventExpression.ClientY],
    preventDefault: true,
    stopPropagation: true,
  })
})
