import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'

test('commandMap - includes MainArea.hasActiveTextEditor', () => {
  expect(commandMap['MainArea.hasActiveTextEditor']).toBeDefined()
})

test('commandMap - includes dirty-tab queries', () => {
  expect(commandMap['Main.closeAllEditorsAndSave']).toBeDefined()
  expect(commandMap['Main.hasDirtyTabs']).toBeDefined()
  expect(commandMap['MainArea.closeAllEditorsAndSave']).toBeDefined()
  expect(commandMap['MainArea.hasDirtyTabs']).toBeDefined()
})

test('commandMap - includes Main.focus', () => {
  expect(commandMap['Main.focus']).toBeDefined()
})

test('commandMap - includes MainArea.focus bridge command', () => {
  expect(commandMap['MainArea.focus']).toBeDefined()
})

test('commandMap - includes sash corner pointer commands', () => {
  expect(commandMap['MainArea.handleSashCornerPointerDown']).toBeDefined()
  expect(commandMap['MainArea.handleSashCornerPointerMove']).toBeDefined()
  expect(commandMap['MainArea.handleSashCornerPointerUp']).toBeDefined()
})

test('commandMap - includes tab drag lifecycle commands', () => {
  expect(commandMap['MainArea.handleDragStart']).toBeDefined()
  expect(commandMap['MainArea.handleDragEnd']).toBeDefined()
  expect(commandMap['MainArea.handleTabMouseUp']).toBeDefined()
})

test('commandMap - resize returns no commands for an unknown instance', async () => {
  expect(await commandMap['MainArea.resize'](999, {})).toEqual([])
})
