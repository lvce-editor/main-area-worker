import { expect, test } from '@jest/globals'
import type { MainAreaLayout } from '../src/parts/MainAreaLayout/MainAreaLayout.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss should return a string', () => {
  const css = getCss()
  expect(typeof css).toBe('string')
})

test('getCss should include MainArea selector', () => {
  const css = getCss()
  expect(css).toContain('.MainArea')
})

test('getCss should include sash selectors', () => {
  const css = getCss()
  expect(css).toContain('.MainArea')
  expect(css).toContain('.editor-groups-container')
  expect(css).toContain('.EditorGroup')
  expect(css).toContain('.SashVertical')
  expect(css).toContain('.SashHorizontal')
})

test('getCss should include layout-specific group and sash rules', () => {
  const layout: MainAreaLayout = {
    activeGroupId: 1,
    direction: 1,
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
  const css = getCss(layout)
  expect(css).toContain('.EditorGroup[data-group-id="1"]')
  expect(css).toContain('--EditorGroupWidth: 40%')
  expect(css).toContain('.EditorGroup[data-group-id="2"]')
  expect(css).toContain('--EditorGroupWidth: 60%')
  expect(css).toContain('.Sash[data-sash-id="1:2"]')
  expect(css).toContain('--SashLeft: 40%')
})
