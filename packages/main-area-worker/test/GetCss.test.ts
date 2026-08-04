import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

test('getCss should return no css when there is no layout', () => {
  const result = getCss()

  expect(result).toBe('')
})

test('getCss should position the sash corner at the grid intersection', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        focused: true,
        id: 1,
        isEmpty: true,
        segmentId: 1,
        size: 30,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 2,
        isEmpty: true,
        segmentId: 1,
        size: 30,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 3,
        isEmpty: true,
        segmentId: 2,
        size: 20,
        tabs: [],
      },
      {
        activeTabId: -1,
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

test('getCss should position the drag overlay', () => {
  const layout: MainAreaLayout = {
    activeGroupId: -1,
    direction: LayoutDirection.Horizontal,
    groups: [],
  }
  const result = getCss(layout, 800, {
    height: 300,
    width: 400,
    x: 0,
    y: 35,
  })

  expect(result).toContain(`.DragOverlay {
  --DragOverlayLeft: 0px;
  --DragOverlayTop: 35px;
  --DragOverlayWidth: 400px;
  --DragOverlayHeight: 300px;
}`)
})
