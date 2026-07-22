import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

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
  expect(result).toContain(`.SashCorner {
  position: absolute;`)
  expect(result).toContain('cursor: all-scroll;')
})

test('getCss should position the sash corner at the grid intersection', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: true,
        id: 1,
        isEmpty: true,
        segmentId: 1,
        size: 30,
        tabs: [],
      },
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 2,
        isEmpty: true,
        segmentId: 1,
        size: 30,
        tabs: [],
      },
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 3,
        isEmpty: true,
        segmentId: 2,
        size: 20,
        tabs: [],
      },
      {
        activeTabId: undefined,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 4,
        isEmpty: true,
        segmentId: 2,
        size: 20,
        tabs: [],
      },
    ],
  }

  const result = getCss(layout)

  expect(result).toContain(`.SashCorner {
  left: 60%;
  top: 50%;
}`)
})
