import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getEditorGroupCss } from '../src/parts/GetEditorGroupCss/GetEditorGroupCss.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

test('getEditorGroupCss should use width for horizontal layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
    groups: [
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 40,
        tabs: [],
      },
      {
        activeTabId: -1,
        direction: LayoutDirection.Horizontal,
        focused: false,
        id: 2,
        isEmpty: true,
        size: 60,
        tabs: [],
      },
    ],
  }

  const result = getEditorGroupCss(layout)

  expect(result).toEqual([
    `.EditorGroup-1 {
  width: 40%;
  height: 100%;
}`,
    `.EditorGroup-2 {
  width: 60%;
  height: 100%;
}`,
  ])
})

test('getEditorGroupCss should use height for vertical layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Vertical,
    groups: [
      {
        activeTabId: -1,
        direction: LayoutDirection.Vertical,
        focused: false,
        id: 1,
        isEmpty: true,
        size: 100,
        tabs: [],
      },
    ],
  }

  const result = getEditorGroupCss(layout)

  expect(result).toEqual([
    `.EditorGroup-1 {
  width: 100%;
  height: 100%;
}`,
  ])
})

test.each([LayoutDirection.Horizontal, LayoutDirection.Vertical] as const)('sizes nested segments and their groups for direction %s', (direction) => {
  const nestedDirection = direction === LayoutDirection.Horizontal ? LayoutDirection.Vertical : LayoutDirection.Horizontal
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction,
    groups: [10, 30, 60].map((size, index) => ({
      activeTabId: -1,
      direction: index < 2 ? nestedDirection : direction,
      focused: false,
      id: (index + 1) / 10,
      isEmpty: true,
      segmentId: 1,
      size,
      tabs: [],
    })),
  }
  const result = getEditorGroupCss(layout)
  const outerProperty = direction === LayoutDirection.Horizontal ? 'width' : 'height'
  const innerProperty = direction === LayoutDirection.Horizontal ? 'height' : 'width'
  expect(result).toHaveLength(4)
  expect(result[0]).toContain('.EditorGroup-0-1-Segment {')
  expect(result[0]).toContain(`${outerProperty}: 40%;`)
  expect(result[1]).toContain('.EditorGroup-0-1 {')
  expect(result[1]).toContain(`${innerProperty}: 25%;`)
  expect(result[2]).toContain(`${innerProperty}: 75%;`)
  expect(result[3]).toContain(`${outerProperty}: 60%;`)
})
