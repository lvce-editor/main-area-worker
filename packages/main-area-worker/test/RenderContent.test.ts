import { expect, test } from '@jest/globals'
import { renderContent } from './RenderContent.ts'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

test('renderContent returns content virtual dom nodes', () => {
  const content = 'Hello, World!'
  const result = renderContent(content)

  expect(result).toHaveLength(3)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'TextEditor',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: 'EditorContent',
    type: VirtualDomElements.Pre,
  })
  expect(result[2]).toEqual(expect.objectContaining({ value: content }))
})

test('renderContent handles empty content', () => {
  const result = renderContent('')

  expect(result).toHaveLength(3)
  expect(result[2]).toEqual(expect.objectContaining({ value: '' }))
})

test('renderContent handles multiline content', () => {
  const content = 'line 1\nline 2\nline 3'
  const result = renderContent(content)

  expect(result).toHaveLength(3)
  expect(result[2]).toEqual(expect.objectContaining({ value: content }))
})
