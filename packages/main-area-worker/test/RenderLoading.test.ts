import { expect, test } from '@jest/globals'
import { renderLoading } from './RenderLoading.ts'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

test('renderLoading returns loading state virtual dom nodes', () => {
  const result = renderLoading()

  expect(result).toHaveLength(3)
  expect(result[0]).toEqual({
    childCount: 1,
    className: 'TextEditor TextEditor--loading',
    type: VirtualDomElements.Div,
  })
  expect(result[1]).toEqual({
    childCount: 1,
    className: 'EditorContent EditorContent--loading',
    type: VirtualDomElements.Div,
  })
  expect(result[2]).toEqual(expect.objectContaining({ value: 'Loading...' }))
})
