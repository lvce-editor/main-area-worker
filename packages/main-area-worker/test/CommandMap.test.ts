import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('commandMap - includes MainArea.hasActiveTextEditor', () => {
  expect(commandMap['MainArea.hasActiveTextEditor']).toBeDefined()
})
