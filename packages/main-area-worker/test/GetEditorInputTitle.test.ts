import { expect, test } from '@jest/globals'
import { getEditorInputTitle } from '../src/parts/GetEditorInputTitle/GetEditorInputTitle.ts'

test('getEditorInputTitle returns the running extensions title', () => {
  expect(getEditorInputTitle({ type: 'running-extensions' })).toBe('Running Extensions')
})

test('getEditorInputTitle returns the binary input file name', () => {
  expect(getEditorInputTitle({ type: 'binary', uri: 'file:///path/archive.zip' })).toBe('archive.zip')
})
