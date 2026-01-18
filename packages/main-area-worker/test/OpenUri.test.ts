import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../src/parts/OpenUriOptions/OpenUriOptions.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'

test('openUri should create a new group and tab when no groups exist', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.activeGroupId).toBeDefined()
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].path).toBe('file:///path/to/file.ts')
  expect(result.layout.groups[0].tabs[0].title).toBe('file:///path/to/file.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[0].id)
  expect(result.layout.groups[0].focused).toBe(true)
})

test('openUri should add tab to active group when group exists', async () => {
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
              content: 'existing content',
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              title: 'Existing File',
            },
          ],
        },
      ],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/new/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs[1].path).toBe('file:///path/to/new/file.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[1].id)
})

test('openUri should activate existing tab if URI already exists', async () => {
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
              content: 'existing content',
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              path: 'file:///path/to/file.ts',
              title: 'Existing File',
            },
            {
              content: 'other content',
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              path: 'file:///path/to/other/file.ts',
              title: 'Other File',
            },
          ],
        },
      ],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('openUri should activate existing tab in different group', async () => {
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
          size: 50,
          tabs: [
            {
              content: 'content',
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              path: 'file:///path/to/file1.ts',
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'content',
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              path: 'file:///path/to/file2.ts',
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file2.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs.length).toBe(1)
  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.groups[1].activeTabId).toBe(2)
  expect(result.layout.groups[1].focused).toBe(true)
})

test('openUri should create group when activeGroupId points to non-existent group', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 999,
      direction: 'horizontal',
      groups: [],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.activeGroupId).toBeDefined()
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].path).toBe('file:///path/to/file.ts')
})

test('openUri should validate state parameter', async () => {
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  await expect(openUri(null as any, options)).rejects.toThrow()
})

test('openUri should validate options parameter', async () => {
  const state: MainAreaState = createDefaultState()

  await expect(openUri(state, null as any)).rejects.toThrow()
})
