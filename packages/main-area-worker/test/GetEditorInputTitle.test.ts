import { expect, test } from '@jest/globals'
import { getEditorInputTitle } from '../src/parts/GetEditorInputTitle/GetEditorInputTitle.ts'

test('getEditorInputTitle returns the running extensions title', () => {
  expect(getEditorInputTitle({ type: 'running-extensions' })).toBe('Running Extensions')
})
