import { expect, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import type { ContextMenuProps } from '../src/parts/ContextMenuProps/ContextMenuProps.ts'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MenuEntries from '../src/parts/MenuEntries/MenuEntries.ts'

test('getMenuEntries returns tab menu entries when menuId is Tab', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
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
              title: 'file.txt',
              uri: '/home/user/file.txt',
            },
          ],
        },
      ],
    },
  }

  const props: ContextMenuProps = {
    menuId: MenuEntryId.Tab,
  }

  const result = await MenuEntries.getMenuEntries(state, props)
  expect(result).toBeDefined()
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)
})

test('getMenuEntries returns empty array for unknown menuId', async () => {
  const state: MainAreaState = createDefaultState()

  const props: ContextMenuProps = {
    // @ts-ignore
    menuId: 999, // Unknown menu ID
  }

  const result = await MenuEntries.getMenuEntries(state, props)
  expect(result).toEqual([])
})

test.skip('getMenuEntries throws when state has no tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: -1,
          focused: true,
          id: 0,,
    isEmpty: true
          size: 100,
          tabs: [],
        },
      ],
    },
  }

  const props: ContextMenuProps = {
    menuId: MenuEntryId.Tab,
  }

  await expect(MenuEntries.getMenuEntries(state, props)).rejects.toThrow()
})

test('getMenuEntries handles state with multiple tabs', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
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
              id: 0,
              isDirty: false,
              title: 'file1.txt',
              uri: '/home/user/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: '',
              id: 1,
              isDirty: true,
              title: 'file2.txt',
              uri: '/home/user/file2.txt',
            },
          ],
        },
      ],
    },
  }

  const props: ContextMenuProps = {
    menuId: MenuEntryId.Tab,
  }

  const result = await MenuEntries.getMenuEntries(state, props)
  expect(result).toBeDefined()
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)
})

test('getMenuEntries handles state with multiple groups', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
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
              title: 'file1.txt',
              uri: '/home/user/file1.txt',
            },
          ],
        },
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
              title: 'file2.txt',
              uri: '/home/user/file2.txt',
            },
          ],
        },
      ],
    },
  }

  const props: ContextMenuProps = {
    menuId: MenuEntryId.Tab,
  }

  const result = await MenuEntries.getMenuEntries(state, props)
  expect(result).toBeDefined()
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)
})

test('getMenuEntries returns consistent result for same input', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
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
              title: 'file.txt',
              uri: '/home/user/file.txt',
            },
          ],
        },
      ],
    },
  }

  const props: ContextMenuProps = {
    menuId: MenuEntryId.Tab,
  }

  const result1 = await MenuEntries.getMenuEntries(state, props)
  const result2 = await MenuEntries.getMenuEntries(state, props)
  expect(result1).toEqual(result2)
})

test('getMenuEntries handles tab without uri', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 0,
      direction: 'horizontal',
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
              title: 'Untitled',
            },
          ],
        },
      ],
    },
  }

  const props: ContextMenuProps = {
    menuId: MenuEntryId.Tab,
  }

  const result = await MenuEntries.getMenuEntries(state, props)
  expect(result).toBeDefined()
  expect(Array.isArray(result)).toBe(true)
})
