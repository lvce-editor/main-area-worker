import { expect, test } from '@jest/globals'
import * as LayoutDirection from '../src/parts/LayoutDirection/LayoutDirection.ts'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getEditorGroupCss } from '../src/parts/GetEditorGroupCss/GetEditorGroupCss.ts'

test('getEditorGroupCss should use width variable for horizontal layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Horizontal,
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

  const result = getEditorGroupCss(layout)

  expect(result).toEqual([
    `.EditorGroup[data-groupId="1"] {
  --EditorGroupWidth: 40%;
}`,
    `.EditorGroup[data-groupId="2"] {
  --EditorGroupWidth: 60%;
}`,
  ])
})

test('getEditorGroupCss should use height variable for vertical layouts', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: LayoutDirection.Vertical,
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

  const result = getEditorGroupCss(layout)

  expect(result).toEqual([
    `.EditorGroup[data-groupId="1"] {
  --EditorGroupHeight: 100%;
}`,
  ])
})
