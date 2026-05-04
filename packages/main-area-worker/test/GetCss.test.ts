import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss should include sash border orientation rules', () => {
  const result = getCss()

  expect(result).toContain(`.SashBorder {
  background: var(--SashBorder, gray);
}`)
  expect(result).toContain(`.SashBorderHorizontal {
  width: 100%;
  height: 1px;
}`)
  expect(result).toContain(`.SashBorderVertical {
  width: 1px;
  height: 100%;
}`)
})
