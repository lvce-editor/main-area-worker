import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openTab } from '../src/parts/OpenTab/OpenTab.ts'

test('openTab assigns default preview state and an id', () => {
  const state = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1 as const,
      groups: [
        {
          activeTabId: undefined,
          direction: 1 as const,
          focused: true,
          id: 1,
          isEmpty: true,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const result = openTab(state, 1, {
    editorType: 'text',
    editorUid: 1,
    icon: '',
    isDirty: false,
    title: 'file.ts',
    uri: '/file.ts',
  })

  expect(result.layout.groups[0].tabs[0]).toMatchObject({
    id: expect.any(Number),
    isPreview: false,
  })
})
