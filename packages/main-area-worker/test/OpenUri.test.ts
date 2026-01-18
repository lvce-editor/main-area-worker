import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../src/parts/OpenUriOptions/OpenUriOptions.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'

test('openUri should return state with valid inputs', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result).toEqual(state)
})

test('openUri should handle focus option', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: true,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result).toEqual(state)
})

test('openUri should handle preview option', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: true,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result).toEqual(state)
})

test('openUri should handle both focus and preview options', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: true,
    preview: true,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result).toEqual(state)
})

test('openUri should handle different URI formats', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///absolute/path/to/file.js',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result).toEqual(state)
})

test('openUri should handle state with existing groups', async () => {
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
  expect(result).toEqual(state)
})

test('openUri should handle empty URI', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: '',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result).toEqual(state)
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
