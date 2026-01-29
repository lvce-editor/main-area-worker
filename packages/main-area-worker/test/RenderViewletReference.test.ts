import { expect, test } from '@jest/globals'
import type { Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { renderViewletReference } from '../src/parts/RenderEditor/RenderViewletReference/RenderViewletReference.ts'

test('renderViewletReference returns reference node with correct uid', () => {
  const tab: Tab = {
    content: '',
    editorUid: 42,
    errorMessage: '',
    isDirty: false,
    isTempSession: false,
    loadingState: 'loaded',
    uri: 'file:///test.txt',
    viewletId: 'test-viewlet',
    viewletInstanceId: '1',
  } as Tab

  const result = renderViewletReference(tab)

  expect(result).toEqual([
    {
      childCount: 0,
      type: 100,
      uid: 42,
    },
  ])
})

test('renderViewletReference handles different uid values', () => {
  const tab: Tab = {
    content: '',
    editorUid: 999,
    errorMessage: '',
    isDirty: false,
    isTempSession: false,
    loadingState: 'loaded',
    uri: 'file:///test.txt',
    viewletId: 'test-viewlet',
    viewletInstanceId: '1',
  } as Tab

  const result = renderViewletReference(tab)

  expect(result[0]).toEqual(
    expect.objectContaining({
      type: 100,
      uid: 999,
    }),
  )
})

test('renderViewletReference creates reference node for viewlet instance', () => {
  const tab: Tab = {
    content: '',
    editorUid: 1,
    errorMessage: '',
    isDirty: false,
    isTempSession: false,
    loadingState: 'loaded',
    uri: 'file:///data.json',
    viewletId: 'custom.editor',
    viewletInstanceId: 'custom-viewlet-123',
  } as Tab

  const result = renderViewletReference(tab)

  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    childCount: 0,
    type: 100,
    uid: 1,
  })
})
