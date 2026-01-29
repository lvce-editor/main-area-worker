import { expect, test } from '@jest/globals'
import { renderError } from './RenderError.ts'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

test('renderError returns error state virtual dom nodes', () => {
  const errorMessage = 'Test error message'
  const result = renderError(errorMessage)

  expect(result).toHaveLength(3)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'TextEditor TextEditor--error',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: 'EditorContent EditorContent--error',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual(expect.objectContaining({ value: `Error: ${errorMessage}` }))
})

test('renderError handles empty error message', () => {
  const result = renderError('')

  expect(result).toHaveLength(3)
  expect(result[2]).toEqual(expect.objectContaining({ value: 'Error: ' }))
})
