import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getSashCorner } from '../src/parts/GetSashCorner/GetSashCorner.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

const createGridLayout = (): MainAreaLayout => ({
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
      size: 25,
      tabs: [],
    },
    {
      activeTabId: undefined,
      direction: LayoutDirection.Vertical,
      focused: false,
      id: 2,
      isEmpty: true,
      segmentId: 1,
      size: 25,
      tabs: [],
    },
    {
      activeTabId: undefined,
      direction: LayoutDirection.Vertical,
      focused: false,
      id: 3,
      isEmpty: true,
      segmentId: 2,
      size: 25,
      tabs: [],
    },
    {
      activeTabId: undefined,
      direction: LayoutDirection.Vertical,
      focused: false,
      id: 4,
      isEmpty: true,
      segmentId: 2,
      size: 25,
      tabs: [],
    },
  ],
})

test('getSashCorner should describe the intersection in a grid layout', () => {
  const result = getSashCorner(createGridLayout())

  expect(result).toEqual({
    leftOffset: 50,
    topOffset: 50,
    xAfterGroupIds: [3, 4],
    xBeforeGroupIds: [1, 2],
    yAfterGroupIds: [2, 4],
    yBeforeGroupIds: [1, 3],
  })
})

test('getSashCorner should describe a vertically oriented grid layout', () => {
  const layout = createGridLayout()
  const result = getSashCorner({
    ...layout,
    direction: LayoutDirection.Vertical,
    groups: layout.groups.map((group) => ({
      ...group,
      direction: LayoutDirection.Horizontal,
    })),
  })

  expect(result).toEqual({
    leftOffset: 50,
    topOffset: 50,
    xAfterGroupIds: [2, 4],
    xBeforeGroupIds: [1, 3],
    yAfterGroupIds: [3, 4],
    yBeforeGroupIds: [1, 2],
  })
})

test('getSashCorner should return undefined for a non-grid layout', () => {
  const layout = createGridLayout()
  const result = getSashCorner({
    ...layout,
    groups: layout.groups.slice(0, 2).map((group) => ({
      ...group,
      direction: undefined,
      segmentId: undefined,
      size: 50,
    })),
  })

  expect(result).toBeUndefined()
})

test('getSashCorner should return undefined when nested sashes do not align', () => {
  const layout = createGridLayout()
  const result = getSashCorner({
    ...layout,
    groups: layout.groups.map((group, index) => {
      const size = [25, 25, 20, 30][index]
      return {
        ...group,
        size,
      }
    }),
  })

  expect(result).toBeUndefined()
})
