import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getSelectedTabData } from '../src/parts/SelectTab/GetSelectedTabData/GetSelectedTabData.ts'

test('getSelectedTabData should return selected tab data for valid indexes', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              isPreview: false,
              title: 'File 1',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 2,
              isDirty: true,
              isPreview: false,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }

  expect(getSelectedTabData(state, 0, 1)).toEqual({
    group: state.layout.groups[0],
    groupId: 1,
    tab: state.layout.groups[0].tabs[1],
    tabId: 2,
  })
})

test('getSelectedTabData should return undefined for invalid indexes', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  expect(getSelectedTabData(state, 1, 0)).toBeUndefined()
  expect(getSelectedTabData(state, 0, -1)).toBeUndefined()
  expect(getSelectedTabData(state, 0, 0)).toBeUndefined()
})
