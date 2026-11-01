import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getSashOffset } from '../src/parts/GetSashOffset/GetSashOffset.ts'

test('getSashOffset should return percentage offset for vertical layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 2,
    groups: [
      {
        activeTabId: -1,
        direction: 2,
        id: 1,
        isEmpty: true,
        isFocused: false,
        size: 40,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: 2,
        id: 2,
        isEmpty: true,
        isFocused: false,
        size: 60,
        tabs: [],
      },
    ],
  }

  expect(getSashOffset(layout, 1, 600)).toBe('40%')
})

test('getSashOffset should return percentage offset for horizontal layouts without overflow', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: -1,
        direction: 1,
        id: 1,
        isEmpty: true,
        isFocused: false,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: 1,
        id: 2,
        isEmpty: true,
        isFocused: false,
        size: 25,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: 1,
        id: 3,
        isEmpty: true,
        isFocused: false,
        size: 50,
        tabs: [],
      },
    ],
  }

  expect(getSashOffset(layout, 2, 1200)).toBe('50%')
})

test('getSashOffset should return pixel offset for horizontal layouts with overflow', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
    groups: [
      {
        activeTabId: -1,
        direction: 1,
        id: 1,
        isEmpty: true,
        isFocused: false,
        size: 33.333333,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: 1,
        id: 2,
        isEmpty: true,
        isFocused: false,
        size: 33.333333,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: 1,
        id: 3,
        isEmpty: true,
        isFocused: false,
        size: 33.333334,
        tabs: [],
      },
    ],
  }

  expect(getSashOffset(layout, 2, 600)).toBe('500px')
})
