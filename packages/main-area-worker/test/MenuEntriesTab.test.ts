import { expect, test } from '@jest/globals'
import { MenuItemFlags } from '@lvce-editor/constants'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MenuEntriesTab from '../src/parts/MenuEntriesTab/MenuEntriesTab.ts'

test('getMenuEntries returns correct menu entries for active tab with path', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 0,
          focused: true,
          id: 0,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 0,
              isDirty: false,
              path: '/home/user/file.txt',
              title: 'file.txt',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(result).toHaveLength(8)
  expect(result[0]).toEqual({
    command: 'Main.closeFocusedTab',
    flags: MenuItemFlags.None,
    id: 'tabClose',
    label: 'Close',
  })
  expect(result[1]).toEqual({
    command: 'Main.closeOthers',
    flags: MenuItemFlags.None,
    id: 'tabCloseOthers',
    label: 'Close Others',
  })
  expect(result[2]).toEqual({
    command: 'Main.closeTabsRight',
    flags: MenuItemFlags.None,
    id: 'tabCloseToTheRight',
    label: 'Close To The Right',
  })
  expect(result[3]).toEqual({
    command: 'Main.closeAllEditors',
    flags: MenuItemFlags.None,
    id: 'tabCloseAll',
    label: 'Close All',
  })
  expect(result[4]).toEqual({
    command: '',
    flags: MenuItemFlags.Separator,
    id: 'separator',
    label: '',
  })
  expect(result[5]).toEqual({
    args: ['/home/user/file.txt'],
    command: 'Explorer.revealItem',
    flags: MenuItemFlags.None,
    id: 'revealInExplorer',
    label: 'Reveal in Explorer',
  })
  expect(result[6]).toEqual({
    command: '',
    flags: MenuItemFlags.Separator,
    id: 'separator',
    label: '',
  })
  expect(result[7]).toEqual({
    args: ['References', true, '/home/user/file.txt'],
    command: 'SideBar.show',
    flags: MenuItemFlags.None,
    id: 'findFileReferences',
    label: 'Find File References',
  })
})

test('getMenuEntries includes correct path in args for reveal and find references', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 0,
          focused: true,
          id: 0,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 0,
              isDirty: false,
              path: '/workspace/src/index.ts',
              title: 'index.ts',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(result[5].args).toEqual(['/workspace/src/index.ts'])
  expect(result[7].args).toEqual(['References', true, '/workspace/src/index.ts'])
})

test('getMenuEntries handles tab without path', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 0,
          focused: true,
          id: 0,
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 0,
              isDirty: false,
              title: 'Untitled',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(result[5].args).toEqual([undefined])
  expect(result[7].args).toEqual(['References', true, undefined])
})

test('getMenuEntries uses correct active tab from multiple tabs', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 0,
          size: 100,
          tabs: [
            {
              content: 'content1',
              editorType: 'text',
              id: 0,
              isDirty: false,
              path: '/file1.txt',
              title: 'file1.txt',
            },
            {
              content: 'content2',
              editorType: 'text',
              id: 1,
              isDirty: false,
              path: '/file2.txt',
              title: 'file2.txt',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(result[5].args).toEqual(['/file2.txt'])
  expect(result[7].args).toEqual(['References', true, '/file2.txt'])
})

test('getMenuEntries uses correct active group from multiple groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 0,
          focused: false,
          id: 0,
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text',
              id: 0,
              isDirty: false,
              path: '/group1/file.txt',
              title: 'file.txt',
            },
          ],
        },
        {
          activeTabId: 0,
          focused: true,
          id: 1,
          size: 50,
          tabs: [
            {
              content: 'content2',
              editorType: 'text',
              id: 0,
              isDirty: false,
              path: '/group2/file.txt',
              title: 'file.txt',
            },
          ],
        },
      ],
    },
  }
  const result = MenuEntriesTab.getMenuEntries(state)
  expect(result[5].args).toEqual(['/group2/file.txt'])
  expect(result[7].args).toEqual(['References', true, '/group2/file.txt'])
})
