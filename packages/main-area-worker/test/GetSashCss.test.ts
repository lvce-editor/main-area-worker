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
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 1,
        isEmpty: true,
        isFocused: false,
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
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 1,
        isEmpty: true,
        isFocused: false,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 2,
        isEmpty: true,
        isFocused: false,
        size: 35,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 3,
        isEmpty: true,
        isFocused: false,
        size: 40,
        tabs: [],
      },
    ],
  }

  const result = getSashCss(layout, 0)

  expect(result).toEqual([
    `[data-sash-id="1:2"] {
  left: 25%;
}`,
    `[data-sash-id="2:3"] {
  left: 60%;
}`,
  ])
})

test('getSashCss should use top positions for vertical layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Vertical,
    groups: [
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        id: 1,
        isEmpty: true,
        isFocused: false,
        size: 45,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        id: 2,
        isEmpty: true,
        isFocused: false,
        size: 55,
        tabs: [],
      },
    ],
  }

  const result = getSashCss(layout, 0)

  expect(result).toEqual([
    `[data-sash-id="1:2"] {
  top: 45%;
}`,
  ])
})

test('getSashCss should use pixel left positions for horizontal layouts with overflowing groups', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 1,
        isEmpty: true,
        isFocused: false,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 2,
        isEmpty: true,
        isFocused: false,
        size: 35,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 3,
        isEmpty: true,
        isFocused: false,
        size: 40,
        tabs: [],
      },
    ],
  }

  const result = getSashCss(layout, 600)

  expect(result).toEqual([
    `[data-sash-id="1:2"] {
  left: 250px;
}`,
    `[data-sash-id="2:3"] {
  left: 500px;
}`,
  ])
})

test('getSashCss should use percentage offsets for nested segments and nested sashes', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        id: 1,
        isEmpty: true,
        isFocused: false,
        size: 30,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        id: 2,
        isEmpty: true,
        isFocused: false,
        size: 20,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        id: 3,
        isEmpty: true,
        isFocused: false,
        size: 50,
        tabs: [],
      },
    ],
  }

  const result = getSashCss(layout, 600)

  expect(result).toEqual([
    `[data-sash-id="1:2"] {
  left: 30%;
}`,
    `[data-sash-id="2:3"] {
  top: 28.571429%;
}`,
  ])
})
