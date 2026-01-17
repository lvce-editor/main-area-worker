import { expect, test } from '@jest/globals'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return array with HandleClick event listener', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toBeDefined()
})
