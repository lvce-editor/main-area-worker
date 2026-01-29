import { expect, test } from '@jest/globals'
import { renderError } from '../src/parts/RenderEditor/RenderError/RenderError.ts'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'

test('renderError returns error state virtual dom nodes', () => {
  const errorMessage = 'Test error message'
  const result = renderError(errorMessage)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'TextEditor TextEditor--error',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--error',
      type: VirtualDomElements.Div,
    },
    text(`Error: ${errorMessage}`),
  ])
})

test('renderError handles empty error message', () => {
  const result = renderError('')

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'TextEditor TextEditor--error',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--error',
      type: VirtualDomElements.Div,
    },
    text('Error: '),
  ])
})

test('renderError handles multiline error message', () => {
  const errorMessage = 'Line 1\nLine 2\nLine 3'
  const result = renderError(errorMessage)

  expect(result[2]).toEqual(text(`Error: ${errorMessage}`))
})
