import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('commandMap - includes MainArea.hasActiveTextEditor', () => {
  expect(commandMap['MainArea.hasActiveTextEditor']).toBeDefined()
})

test('commandMap - includes the close all editors command palette id', () => {
  expect(commandMap['Main.CloseAllEditors']).toBeDefined()
})
