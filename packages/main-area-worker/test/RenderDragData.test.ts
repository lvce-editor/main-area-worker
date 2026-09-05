import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderDragData } from '../src/parts/RenderDragData/RenderDragData.ts'

const createState = (uri?: string): MainAreaState => {
  return {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorUid: 1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
              uri,
            },
          ],
        },
      ],
    },
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 0,
    uid: 42,
  }
}

test('renderDragData should render file drag data for the pointed tab', () => {
  const state = createState('/workspace/file.txt')

  expect(renderDragData(createDefaultState(), state)).toEqual([
    'Viewlet.setDragData',
    42,
    {
      items: [
        { data: 'file:///workspace/file.txt', type: 'text/uri-list' },
        { data: 'file:///workspace/file.txt', type: 'text/plain' },
      ],
      label: 'file.txt',
    },
  ])
})

test('renderDragData should preserve an existing uri scheme', () => {
  const state = createState('file:///workspace/file.txt')

  expect(renderDragData(createDefaultState(), state)[2].items[0].data).toBe('file:///workspace/file.txt')
})

test('renderDragData should return no command without a pointed tab', () => {
  const state = createDefaultState()

  expect(renderDragData(state, state)).toEqual([])
})

test('renderDragData should return no command when the pointed tab has no uri', () => {
  const state = createState()

  expect(renderDragData(createDefaultState(), state)).toEqual([])
})

test('renderDragData should return no command when the pointed group does not exist', () => {
  const state = {
    ...createState('/workspace/file.txt'),
    pointerDownGroupIndex: 1,
  }

  expect(renderDragData(createDefaultState(), state)).toEqual([])
})
