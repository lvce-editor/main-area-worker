import { expect, test } from '@jest/globals'
import { MenuItemFlags } from '@lvce-editor/constants'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MenuEntriesTab from '../src/parts/MenuEntriesTab/MenuEntriesTab.ts'

const getEntryById = (entries: readonly any[], id: string): any => {
  return entries.find((entry) => entry.id === id)
}

test('getMenuEntries returns correct menu entries for active tab with path', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 0,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 0,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
              uri: '/home/user/file.txt',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(result).toHaveLength(27)
  expect(result.map((entry) => entry.label)).toEqual([
    'Close',
    'Close Others',
    'Close to the Right',
    'Close Saved',
    'Close All',
    '',
    'Copy Path',
    'Copy Relative Path',
    '',
    'Reopen Editor With...',
    '',
    'Share',
    '',
    'Add File to Chat',
    '',
    'Open Containing Folder',
    'Reveal in Explorer View',
    '',
    'Keep Open',
    'Pin',
    '',
    'Split Right',
    'Split & Move',
    'Move into New Window',
    'Copy into New Window',
    '',
    'Find File References',
  ])
  expect(result.filter((entry) => entry.flags === MenuItemFlags.Separator)).toHaveLength(8)
})

test('getMenuEntries includes correct path in args for reveal and find references', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 0,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 0,
              isDirty: false,
              isPreview: false,
              title: 'index.ts',
              uri: '/workspace/src/index.ts',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(getEntryById(result, 'revealInExplorerView').args).toEqual(['/workspace/src/index.ts'])
  expect(getEntryById(result, 'copyPath').args).toEqual(['/workspace/src/index.ts'])
  expect(getEntryById(result, 'copyRelativePath').args).toEqual(['/workspace/src/index.ts'])
  expect(getEntryById(result, 'findFileReferences').args).toEqual(['References', true, '/workspace/src/index.ts'])
})

test('getMenuEntries handles tab without path', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 0,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 0,
              isDirty: false,
              isPreview: false,
              title: 'Untitled',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(getEntryById(result, 'revealInExplorerView').args).toEqual([undefined])
  expect(getEntryById(result, 'copyPath').args).toEqual([undefined])
  expect(getEntryById(result, 'copyRelativePath').args).toEqual([undefined])
  expect(getEntryById(result, 'findFileReferences').args).toEqual(['References', true, undefined])
})

test('getMenuEntries uses correct active tab from multiple tabs', () => {
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
              id: 0,
              isDirty: false,
              isPreview: false,
              title: 'file1.txt',
              uri: '/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'file2.txt',
              uri: '/file2.txt',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(getEntryById(result, 'revealInExplorerView').args).toEqual(['/file2.txt'])
  expect(getEntryById(result, 'copyPath').args).toEqual(['/file2.txt'])
  expect(getEntryById(result, 'copyRelativePath').args).toEqual(['/file2.txt'])
  expect(getEntryById(result, 'findFileReferences').args).toEqual(['References', true, '/file2.txt'])
})

test('getMenuEntries uses correct active group from multiple groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: 0,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 0,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
              uri: '/group1/file.txt',
            },
          ],
        },
        {
          activeTabId: 0,
          focused: true,
          id: 2,
          isEmpty: false,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 0,
              isDirty: false,
              isPreview: false,
              title: 'file.txt',
              uri: '/group2/file.txt',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(getEntryById(result, 'revealInExplorerView').args).toEqual(['/group2/file.txt'])
  expect(getEntryById(result, 'copyPath').args).toEqual(['/group2/file.txt'])
  expect(getEntryById(result, 'copyRelativePath').args).toEqual(['/group2/file.txt'])
  expect(getEntryById(result, 'findFileReferences').args).toEqual(['References', true, '/group2/file.txt'])
})
