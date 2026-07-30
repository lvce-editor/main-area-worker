import { expect, test } from '@jest/globals'
import { getEditorInputUri } from '../src/parts/GetEditorInputUri/GetEditorInputUri.ts'

test('getEditorInputUri returns the running extensions uri', () => {
  expect(getEditorInputUri({ type: 'running-extensions' })).toBe('running-extensions://')
})
