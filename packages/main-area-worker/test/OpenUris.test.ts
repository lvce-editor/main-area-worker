import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { afterEach, expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { openUris, openUrisInThreeColumnsWithContext } from '../src/parts/OpenUris/OpenUris.ts'

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

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].uri).toBe('file:///path/to/file.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[0].id)
})

test('openUris should open each uri and select the last tab', async () => {
  const state: MainAreaState = createDefaultState()

  const result = await openUris(state, ['file:///path/to/file-a.ts', 'file:///path/to/file-b.ts', 'file:///path/to/file-c.ts'])

  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(3)
  expect(result.layout.groups[0].tabs[0].uri).toBe('file:///path/to/file-a.ts')
  expect(result.layout.groups[0].tabs[1].uri).toBe('file:///path/to/file-b.ts')
  expect(result.layout.groups[0].tabs[2].uri).toBe('file:///path/to/file-c.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[2].id)
})

test('openUrisInThreeColumns should reject a URI list with the wrong length before changing state', async () => {
  let updateCount = 0
  const context = {
    getState: () => createDefaultState(),
    updateState: async () => {
      updateCount++
    },
  }

  await expect(
    openUrisInThreeColumnsWithContext(context as unknown as AsyncCommandContext<MainAreaState>, ['file:///one.ts', 'file:///two.ts']),
  ).rejects.toThrow('Expected exactly three URIs')
  expect(updateCount).toBe(0)
})
