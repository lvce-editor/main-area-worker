import { expect, test } from '@jest/globals'
import * as MenuEntriesTab from '../src/parts/MenuEntriesTab/MenuEntriesTab.ts'

test('getMenuEntries should throw error when state is empty', () => {
  expect(() => {
    MenuEntriesTab.getMenuEntries()
  }).toThrow()
})
