import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getSelectedTabBounds } from '../src/parts/SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'

test('getSelectedTabBounds should return content bounds below tab bar', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 640,
    tabHeight: 35,
    width: 800,
    x: 10,
    y: 20,
  }

  expect(getSelectedTabBounds(state)).toEqual({
    height: 605,
    width: 800,
    x: 10,
    y: 55,
  })
})

test('getSelectedTabBounds should include the x offset of a right editor group', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    height: 640,
    layout: {
      activeGroupId: 2,
      direction: 1,
      groups: [
        {
          activeTabId: -1,
          direction: 1,
          focused: false,
          id: 1,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: -1,
          direction: 1,
          focused: true,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
    tabHeight: 35,
    width: 800,
    x: 10,
    y: 20,
  }

  expect(getSelectedTabBounds(state)).toEqual({
    height: 605,
    width: 400,
    x: 410,
    y: 55,
  })
})
