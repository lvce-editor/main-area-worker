import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss should return a string', () => {
  const css = getCss()
  expect(typeof css).toBe('string')
})

test('getCss should include MainArea selector', () => {
  const css = getCss()
  expect(css).toContain('.MainArea')
})

test('getCss should return expected css', () => {
  const css = getCss()
  expect(css).toBe(`.MainArea {
}`)
})
