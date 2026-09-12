import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getEditorGroupCss } from '../src/parts/GetEditorGroupCss/GetEditorGroupCss.ts'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'

test('getEditorGroupCss should use width variable for horizontal layouts', () => {
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
  --EditorGroupWidth: 40%;
  --EditorGroupHeight: 100%;
  width: var(--EditorGroupWidth);
  height: var(--EditorGroupHeight);
}`,
    `.EditorGroup-2 {
  --EditorGroupWidth: 60%;
  --EditorGroupHeight: 100%;
  width: var(--EditorGroupWidth);
  height: var(--EditorGroupHeight);
}`,
  ])
})

test('getEditorGroupCss should use height variable for vertical layouts', () => {
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
  --EditorGroupWidth: 100%;
  --EditorGroupHeight: 100%;
  width: var(--EditorGroupWidth);
  height: var(--EditorGroupHeight);
}`,
  ])
})

test.each([LayoutDirection.Horizontal, LayoutDirection.Vertical])('sizes nested segments and their groups for direction %s', (direction) => {
  const nestedDirection = direction === LayoutDirection.Horizontal ? LayoutDirection.Vertical : LayoutDirection.Horizontal
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction,
    groups: [10, 30, 60].map((size, index) => ({
      activeTabId: -1,
      direction: index < 2 ? nestedDirection : direction,
      focused: false,
      id: index + 1,
      isEmpty: true,
      segmentId: 1,
      size,
      tabs: [],
    })),
  }
  const result = getEditorGroupCss(layout)
  const outerProperty = direction === LayoutDirection.Horizontal ? '--EditorGroupWidth' : '--EditorGroupHeight'
  const innerProperty = direction === LayoutDirection.Horizontal ? '--EditorGroupHeight' : '--EditorGroupWidth'
  expect(result).toHaveLength(4)
  expect(result[0]).toContain('.EditorGroupSegment-1 {')
  expect(result[0]).toContain(`${outerProperty}: 40%;`)
  expect(result[1]).toContain(`${innerProperty}: 25%;`)
  expect(result[2]).toContain(`${innerProperty}: 75%;`)
  expect(result[3]).toContain(`${outerProperty}: 60%;`)
})
