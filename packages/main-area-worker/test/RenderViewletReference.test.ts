import { expect, test } from '@jest/globals'
import type { Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { renderViewletReference } from '../src/parts/RenderEditor/RenderViewletReference/RenderViewletReference.ts'

test('renderViewletReference returns reference node with correct uid', () => {
  const tab: Tab = {
    editorType: 'text',
    editorUid: 42,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Test',
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
    editorType: 'text',
    editorUid: 999,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Test',
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
    editorType: 'text',
    editorUid: 1,
    icon: '',
    id: 1,
    isDirty: false,
    title: 'Test',
  } as Tab

  const result = renderViewletReference(tab)

  expect(result).toHaveLength(1)
  expect(result[0]).toEqual({
    childCount: 0,
    type: 100,
    uid: 1,
  })
})
