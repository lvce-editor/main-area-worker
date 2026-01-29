import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { hasDirtyTabs } from '../src/parts/HasDirtyTabs/HasDirtyTabs.ts'

test('hasDirtyTabs should return true when dirty tabs exist', () => {
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
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              editorUid: -1,
icon: '',
              id: 1,
              isDirty: true,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = hasDirtyTabs(state)
  expect(result).toBe(true)
})

test('hasDirtyTabs should return false when no dirty tabs exist', () => {
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
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              editorUid: -1,
icon: '',
              id: 1,
              isDirty: false,
              title: 'File',
            },
          ],
        },
      ],
    },
  }
  const result = hasDirtyTabs(state)
  expect(result).toBe(false)
})
