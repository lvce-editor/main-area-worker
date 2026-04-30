import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getSashOffset } from '../src/parts/GetSashOffset/GetSashOffset.ts'

test('getSashOffset should return percentage offset for vertical layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 2,
    groups: [
      {
        activeTabId: undefined,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 40,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        isEmpty: true,
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
        size: 25,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 3,
        isEmpty: true,
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
        activeTabId: undefined,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 33.333_333,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 2,
        isEmpty: true,
        size: 33.333_333,
        tabs: [],
      },
      {
        activeTabId: undefined,
        focused: false,
        id: 3,
        isEmpty: true,
        size: 33.333_334,
        tabs: [],
      },
    ],
  }

  expect(getSashOffset(layout, 2, 600)).toBe('500px')
})
