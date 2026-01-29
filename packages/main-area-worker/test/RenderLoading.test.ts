import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import { renderLoading } from '../src/parts/RenderEditor/RenderLoading/RenderLoading.ts'

test('renderLoading returns loading state virtual dom nodes', () => {
  const result = renderLoading()

  expect(result).toEqual([
    {
      childCount: 1,
      className: 'TextEditor TextEditor--loading',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorContent EditorContent--loading',
      type: VirtualDomElements.Div,
    },
    text('Loading...'),
  ])
})
