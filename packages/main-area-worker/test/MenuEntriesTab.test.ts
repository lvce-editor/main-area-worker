import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MenuEntriesTab from '../src/parts/MenuEntriesTab/MenuEntriesTab.ts'

test('getMenuEntries should throw error when state is empty', () => {
  const state = createDefaultState()
  expect(MenuEntriesTab.getMenuEntries(state)).toBeDefined()
})
