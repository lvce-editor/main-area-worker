import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getSashCss } from '../src/parts/GetSashCss/GetSashCss.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

test('getSashCss should return no rules when layout has one group', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 100,
        tabs: [],
      },
    ],
  }

  const result = getSashCss(layout)

  expect(result).toEqual([])
})

test('getSashCss should use left positions for horizontal layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        isEmpty: true,
        size: 35,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 3,
        isEmpty: true,
        size: 40,
        tabs: [],
      },
    ],
  }

  const result = getSashCss(layout)

  expect(result).toEqual([
    `.Sash[data-sashId="1:2"] {
  --SashLeft: 25%;
}`,
    `.Sash[data-sashId="2:3"] {
  --SashLeft: 60%;
}`,
  ])
})

test('getSashCss should use top positions for vertical layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Vertical,
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 45,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        isEmpty: true,
        size: 55,
        tabs: [],
      },
    ],
  }

  const result = getSashCss(layout)

  expect(result).toEqual([
    `.Sash[data-sashId="1:2"] {
  --SashTop: 45%;
}`,
  ])
})
