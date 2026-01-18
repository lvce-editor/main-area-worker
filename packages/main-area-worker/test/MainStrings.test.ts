import { expect, test } from '@jest/globals'
import * as MainStrings from '../src/parts/MainStrings/MainStrings.ts'

test('openFile should return a string', () => {
  const result: string = MainStrings.openFile()
  expect(typeof result).toBe('string')
})

test('splitUp should return a string', () => {
  const result: string = MainStrings.splitUp()
  expect(typeof result).toBe('string')
})

test('splitDown should return a string', () => {
  const result: string = MainStrings.splitDown()
  expect(typeof result).toBe('string')
})

test('splitLeft should return a string', () => {
  const result: string = MainStrings.splitLeft()
  expect(typeof result).toBe('string')
})

test('splitRight should return a string', () => {
  const result: string = MainStrings.splitRight()
  expect(typeof result).toBe('string')
})

test('newWindow should return a string', () => {
  const result: string = MainStrings.newWindow()
  expect(typeof result).toBe('string')
})

test('close should return a string', () => {
  const result: string = MainStrings.close()
  expect(typeof result).toBe('string')
})

test('closeOthers should return a string', () => {
  const result: string = MainStrings.closeOthers()
  expect(typeof result).toBe('string')
})

test('closeAll should return a string', () => {
  const result: string = MainStrings.closeAll()
  expect(typeof result).toBe('string')
})

test('revealInExplorer should return a string', () => {
  const result: string = MainStrings.revealInExplorer()
  expect(typeof result).toBe('string')
})

test('closeToTheRight should return a string', () => {
  const result: string = MainStrings.closeToTheRight()
  expect(typeof result).toBe('string')
})

test('findFileReferences should return a string', () => {
  const result: string = MainStrings.findFileReferences()
  expect(typeof result).toBe('string')
})
