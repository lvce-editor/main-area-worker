import { expect, test } from '@jest/globals'
import { renderContent } from '../src/parts/RenderEditor/RenderContent/RenderContent.ts'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'

test('renderContent returns content virtual dom nodes', () => {
  const content = 'Hello, World!'
  const result = renderContent(content)

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'TextEditor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent',
      type: VirtualDomElements.Pre,
    },
    text(content),
  ])
})

test('renderContent handles empty content', () => {
  const result = renderContent('')

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'TextEditor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent',
      type: VirtualDomElements.Pre,
    },
    text(''),
  ])
})

test('renderContent handles multiline content', () => {
  const content = 'line 1\nline 2\nline 3'
  const result = renderContent(content)

  expect(result).toHaveLength(3)
  expect(result[2]).toEqual(text(content))
})
