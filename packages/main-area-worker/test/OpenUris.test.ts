import { afterEach, expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { openUris } from '../src/parts/OpenUris/OpenUris.ts'

afterEach(() => {
  const defaultState = createDefaultState()
  MainAreaStates.set(0, defaultState, defaultState)
})

test('openUris should return state when uri array is empty', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await openUris(state, [])

  expect(result).toBe(state)
})

test('openUris should call openUri behavior when uri array has one item', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await openUris(state, ['file:///path/to/file.ts'])

  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].uri).toBe('file:///path/to/file.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[0].id)
})

test('openUris should open first uri and create tabs for remaining uris', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await openUris(state, ['file:///path/to/file-a.ts', 'file:///path/to/file-b.ts', 'file:///path/to/file-c.ts'])

  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].tabs.length).toBe(3)
  expect(result.layout.groups[0].tabs[0].uri).toBe('file:///path/to/file-a.ts')
  expect(result.layout.groups[0].tabs[1].uri).toBe('file:///path/to/file-b.ts')
  expect(result.layout.groups[0].tabs[2].uri).toBe('file:///path/to/file-c.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[0].id)
})