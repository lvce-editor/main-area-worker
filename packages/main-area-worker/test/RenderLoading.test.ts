import { expect, test } from '@jest/globals'
import { renderLoading } from '../src/parts/RenderEditor/RenderLoading/RenderLoading.ts'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'

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
