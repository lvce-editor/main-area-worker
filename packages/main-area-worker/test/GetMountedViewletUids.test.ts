import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { Tab } from '../src/parts/Tab/Tab.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getMountedViewletUids } from '../src/parts/GetMountedViewletUids/GetMountedViewletUids.ts'

const tab = (id: number, editorUid: number, loadingState: 'error' | 'loaded' | 'loading'): Tab => ({
  editorUid,
  icon: '',
  id,
  isDirty: false,
  isPreview: false,
  loadingState,
  title: `${id}.txt`,
  uri: `file:///${id}.txt`,
})

test('returns the loaded active tab from every visible editor group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [tab(1, 101, 'loaded'), tab(2, 102, 'loaded')],
        },
        {
          activeTabId: 3,
          direction: 1,
          focused: false,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [tab(3, 103, 'loaded')],
        },
      ],
    },
  }

  expect(getMountedViewletUids(state)).toEqual([102, 103])
})

test('excludes loading, error, missing, and uncreated active tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        { activeTabId: 1, direction: 1, focused: true, id: 1, isEmpty: false, size: 25, tabs: [tab(1, 101, 'loading')] },
        { activeTabId: 2, direction: 1, focused: false, id: 2, isEmpty: false, size: 25, tabs: [tab(2, 102, 'error')] },
        { activeTabId: 3, direction: 1, focused: false, id: 3, isEmpty: false, size: 25, tabs: [tab(3, -1, 'loaded')] },
        { activeTabId: -1, direction: 1, focused: false, id: 4, isEmpty: true, size: 25, tabs: [] },
      ],
    },
  }

  expect(getMountedViewletUids(state)).toEqual([])
})
