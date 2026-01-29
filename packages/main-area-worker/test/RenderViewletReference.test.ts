import { expect, test } from '@jest/globals'
import { renderViewletReference } from './RenderViewletReference.ts'
import type { Tab } from '../../MainAreaState/MainAreaState.ts'

test('renderViewletReference returns reference node with correct uid', () => {
  const tab: Tab = {
    editorUid: 42,
    viewletInstanceId: '1',
    loadingState: 'loaded',
    content: '',
    errorMessage: '',
    isDirty: false,
    viewletId: 'test-viewlet',
    uri: 'file:///test.txt',
    isTempSession: false,
  } as Tab

  const result = renderViewletReference(tab)

  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    childCount: 0,
    type: 100,
    uid: 42,
  })
})

test('renderViewletReference handles different uid values', () => {
  const tab: Tab = {
    editorUid: 999,
    viewletInstanceId: '1',
    loadingState: 'loaded',
    content: '',
    errorMessage: '',
    isDirty: false,
    viewletId: 'test-viewlet',
    uri: 'file:///test.txt',
    isTempSession: false,
  } as Tab

  const result = renderViewletReference(tab)

  expect(result[0]).toEqual(
    expect.objectContaining({
      uid: 999,
    })
  )
})
