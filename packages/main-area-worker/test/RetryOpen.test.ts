import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { retryOpen } from '../src/parts/RetryOpen/RetryOpen.ts'

test('retryOpen should return state unchanged when there is no active tab', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await retryOpen(state)

  expect(result).toBe(state)
})

test('retryOpen should return state unchanged when active tab has no uri', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
      ],
    },
  }

  const result = await retryOpen(state)

  expect(result).toBe(state)
})

test('retryOpen should keep tab layout unchanged when reopening active tab uri', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              loadingState: 'idle',
              title: 'File 1',
              uri: 'file:///workspace/file-1.ts',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: false,
              loadingState: 'idle',
              title: 'File 2',
              uri: 'file:///workspace/file-2.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await retryOpen(state)

  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs.length).toBe(1)
  expect(result.layout.activeGroupId).toBe(1)
  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.layout.groups[0].focused).toBe(true)
})
