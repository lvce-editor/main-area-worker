import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('commandMap - includes MainArea.hasActiveTextEditor', () => {
  expect(commandMap['MainArea.hasActiveTextEditor']).toBeDefined()
})

test('commandMap - includes sash corner pointer commands', () => {
  expect(commandMap['MainArea.handleSashCornerPointerDown']).toBeDefined()
  expect(commandMap['MainArea.handleSashCornerPointerMove']).toBeDefined()
  expect(commandMap['MainArea.handleSashCornerPointerUp']).toBeDefined()
})
