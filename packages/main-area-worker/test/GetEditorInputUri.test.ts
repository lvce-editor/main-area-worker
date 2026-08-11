import { expect, test } from '@jest/globals'
import { getEditorInputUri } from '../src/parts/GetEditorInputUri/GetEditorInputUri.ts'

test('getEditorInputUri returns the running extensions uri', () => {
  expect(getEditorInputUri({ type: 'running-extensions' })).toBe('running-extensions://')
})

test('getEditorInputUri returns the binary input uri', () => {
  expect(getEditorInputUri({ type: 'binary', uri: 'file:///archive.zip' })).toBe('file:///archive.zip')
})
