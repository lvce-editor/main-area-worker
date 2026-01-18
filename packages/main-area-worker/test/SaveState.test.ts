import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { SavedState } from '../src/parts/SavedState/SavedState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { saveState } from '../src/parts/SaveState/SaveState.ts'

<<<<<<< HEAD
test('saveState should return empty arrays when state has no items', () => {
  const uid = 1
  const state: any = { ...createDefaultState(), uid }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([])
})

test('saveState should return itemsLeft when only left items exist', () => {
  const uid = 2
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item 1' }],
    name: 'item1',
    tooltip: 'Tooltip 1',
  }
  const item2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item 2' }],
    name: 'item2',
    tooltip: 'Tooltip 2',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [item1, item2],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([item1, item2])
  expect(result.itemsRight).toEqual([])
})

test('saveState should return itemsRight when only right items exist', () => {
  const uid = 3
  const item1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item 1' }],
    name: 'item1',
    tooltip: 'Tooltip 1',
  }
  const item2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item 2' }],
    name: 'item2',
    tooltip: 'Tooltip 2',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsRight: [item1, item2],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([item1, item2])
})

test('saveState should return both itemsLeft and itemsRight', () => {
  const uid = 4
  const leftItem1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Left 1' }],
    name: 'left1',
    tooltip: 'Left Tooltip 1',
  }
  const leftItem2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Left 2' }],
    name: 'left2',
    tooltip: 'Left Tooltip 2',
  }
  const rightItem1: StatusBarItem = {
    elements: [{ type: 'text', value: 'Right 1' }],
    name: 'right1',
    tooltip: 'Right Tooltip 1',
  }
  const rightItem2: StatusBarItem = {
    elements: [{ type: 'text', value: 'Right 2' }],
    name: 'right2',
    tooltip: 'Right Tooltip 2',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [leftItem1, leftItem2],
    statusBarItemsRight: [rightItem1, rightItem2],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([leftItem1, leftItem2])
  expect(result.itemsRight).toEqual([rightItem1, rightItem2])
})

test('saveState should return items with all properties', () => {
  const uid = 5
  const item: StatusBarItem = {
    command: 'test.command',
    elements: [
      { type: 'icon', value: 'test-icon' },
      { type: 'text', value: 'Test Item' },
    ],
    name: 'test-item',
    tooltip: 'Test Tooltip',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([item])
  expect(result.itemsLeft[0].command).toBe('test.command')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'icon')?.value).toBe('test-icon')
  expect(result.itemsLeft[0].name).toBe('test-item')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'text')?.value).toBe('Test Item')
  expect(result.itemsLeft[0].tooltip).toBe('Test Tooltip')
})

test('saveState should return items with optional properties missing', () => {
  const uid = 6
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsRight).toEqual([item])
  expect(result.itemsRight[0].name).toBe('item')
  expect(result.itemsRight[0]?.elements.find((e) => e.type === 'text')?.value).toBe('Item')
  expect(result.itemsRight[0].tooltip).toBe('Tooltip')
})

test('saveState should handle multiple items in both arrays', () => {
  const uid = 7
  const leftItems: StatusBarItem[] = [
    { elements: [{ type: 'text', value: 'Left 1' }], name: 'left1', tooltip: 'T1' },
    { elements: [{ type: 'text', value: 'Left 2' }], name: 'left2', tooltip: 'T2' },
    { elements: [{ type: 'text', value: 'Left 3' }], name: 'left3', tooltip: 'T3' },
  ]
  const rightItems: StatusBarItem[] = [
    { elements: [{ type: 'text', value: 'Right 1' }], name: 'right1', tooltip: 'T1' },
    { elements: [{ type: 'text', value: 'Right 2' }], name: 'right2', tooltip: 'T2' },
    { elements: [{ type: 'text', value: 'Right 3' }], name: 'right3', tooltip: 'T3' },
  ]
  const state: any = {
    ...createDefaultState(),
    statusBarItemsLeft: leftItems,
    statusBarItemsRight: rightItems,
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toHaveLength(3)
  expect(result.itemsRight).toHaveLength(3)
  expect(result.itemsLeft).toEqual(leftItems)
  expect(result.itemsRight).toEqual(rightItems)
})

test('saveState should work with different uid values', () => {
  const uid1 = 10
  const state1: any = { ...createDefaultState(), uid: uid1 }
  set(uid1, state1, state1)
  const result1 = SaveState.saveState(uid1)
  expect(result1.itemsLeft).toEqual([])
  expect(result1.itemsRight).toEqual([])

  const uid2 = 999
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state2: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid: uid2,
  }
  set(uid2, state2, state2)
  const result2 = SaveState.saveState(uid2)
  expect(result2.itemsLeft).toEqual([item])
})

test('saveState should return newState items, not oldState items', () => {
  const uid = 8
  const oldItem: StatusBarItem = {
    elements: [{ type: 'text', value: 'Old' }],
    name: 'old',
    tooltip: 'Old Tooltip',
  }
  const newItem: StatusBarItem = {
    elements: [{ type: 'text', value: 'New' }],
    name: 'new',
    tooltip: 'New Tooltip',
  }
  const oldState: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [oldItem],
    uid,
  }
  const newState: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [newItem],
    uid,
  }
  set(uid, oldState, newState)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([newItem])
  expect(result.itemsLeft).not.toEqual([oldItem])
})

test('saveState should handle empty string values', () => {
  const uid = 9
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: '' }],
    name: '',
    tooltip: '',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].name).toBe('')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'text')?.value).toBe('')
  expect(result.itemsLeft[0].tooltip).toBe('')
})

test('saveState should preserve item order', () => {
  const uid = 11
  const items: StatusBarItem[] = [
    { elements: [{ type: 'text', value: 'First' }], name: 'first', tooltip: 'T1' },
    { elements: [{ type: 'text', value: 'Second' }], name: 'second', tooltip: 'T2' },
    { elements: [{ type: 'text', value: 'Third' }], name: 'third', tooltip: 'T3' },
  ]
  const state = {
    ...createDefaultState(),
    statusBarItemsLeft: items,
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].name).toBe('first')
  expect(result.itemsLeft[1].name).toBe('second')
  expect(result.itemsLeft[2].name).toBe('third')
})

test('saveState should handle items with only name property', () => {
  const uid = 12
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: '' }],
    name: 'minimal',
    tooltip: '',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsRight[0].name).toBe('minimal')
})

test('saveState should handle items with command and icon', () => {
  const uid = 13
  const item: StatusBarItem = {
    command: 'extension.command',
    elements: [
      { type: 'icon', value: '$(icon-name)' },
      { type: 'text', value: 'Command Item' },
    ],
    name: 'command-item',
    tooltip: 'Command Tooltip',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft[0].command).toBe('extension.command')
  expect(result.itemsLeft[0]?.elements.find((e) => e.type === 'icon')?.value).toBe('$(icon-name)')
})

test('saveState should handle zero uid', () => {
  const uid = 0
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsLeft: [item],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([item])
})

test('saveState should handle negative uid', () => {
  const uid = -1
  const state: any = { ...createDefaultState(), uid }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsLeft).toEqual([])
  expect(result.itemsRight).toEqual([])
})

test('saveState should handle large uid values', () => {
  const uid = 999_999
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: 'Item' }],
    name: 'item',
    tooltip: 'Tooltip',
  }
  const state: any = {
    ...createDefaultState(),
    statusBarItemsRight: [item],
    uid,
  }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(result.itemsRight).toEqual([item])
})

test('saveState should return readonly arrays', () => {
  const uid = 14
  const state: any = { ...createDefaultState(), uid }
  set(uid, state, state)
  const result = SaveState.saveState(uid)
  expect(Object.isFrozen(result.itemsLeft)).toBe(false)
  expect(Array.isArray(result.itemsLeft)).toBe(true)
  expect(Array.isArray(result.itemsRight)).toBe(true)
})

test('saveState should handle mixed items with and without optional properties', () => {
  const uid = 15
  const items: StatusBarItem[] = [
    {
      elements: [{ type: 'text', value: '' }],
      name: 'minimal',
      tooltip: '',
    },
    {
      command: 'cmd',
      elements: [
        { type: 'icon', value: 'icon' },
        { type: 'text', value: 'Full' },
=======
test('saveState should save layout from default state', () => {
  const state: MainAreaState = createDefaultState()
  const result: SavedState = saveState(state)
  expect(result.layout).toEqual(state.layout)
  expect(result.layout.activeGroupId).toBe('0')
  expect(result.layout.direction).toBe('horizontal')
  expect(result.layout.groups).toEqual([])
})

test('saveState should save layout with custom configuration', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 2,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'test content',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'Test File',
            },
          ],
        },
>>>>>>> origin/main
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout).toEqual(state.layout)
  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.direction).toBe('vertical')
  expect(result.layout.groups).toHaveLength(1)
})

test('saveState should only save layout, not other state properties', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    assetDir: '/custom/path',
    disposed: true,
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
    platform: 5,
    uid: 999,
  }
  const result: SavedState = saveState(state)
  expect(result.layout).toEqual(state.layout)
  expect((result as any).assetDir).toBeUndefined()
  expect((result as any).disposed).toBeUndefined()
  expect((result as any).platform).toBeUndefined()
  expect((result as any).uid).toBeUndefined()
})

<<<<<<< HEAD
test('saveState should handle very long item arrays', () => {
  const uid = 16
  const items: StatusBarItem[] = Array.from({ length: 100 }, (_, i) => ({
    elements: [{ type: 'text', value: `Item ${i}` }],
    name: `item${i}`,
    tooltip: `Tooltip ${i}`,
  }))
  const state = {
=======
test('saveState should save layout with multiple groups', () => {
  const state: MainAreaState = {
>>>>>>> origin/main
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 50,
          tabs: [
            {
              content: 'content1',
              editorType: 'text',
              id: 1,
              isDirty: false,
              title: 'File 1',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: 2,
          size: 50,
          tabs: [
            {
              content: 'content2',
              editorType: 'text',
              id: 2,
              isDirty: true,
              title: 'File 2',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(2)
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[1].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('File 1')
  expect(result.layout.groups[1].tabs[0].title).toBe('File 2')
})

<<<<<<< HEAD
test('saveState should handle items with special characters in text', () => {
  const uid = 17
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: 'Special chars: !@#$%^&*()' }],
    name: 'special',
    tooltip: 'Tooltip with "quotes" and \'apostrophes\'',
  }
  const state: any = {
=======
test('saveState should save layout with custom editor tabs', () => {
  const state: MainAreaState = {
>>>>>>> origin/main
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'vertical',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'custom content',
              customEditorId: 'custom-editor-1',
              editorType: 'custom',
              id: 1,
              isDirty: false,
              title: 'Custom Editor',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups[0].tabs[0].editorType).toBe('custom')
  expect(result.layout.groups[0].tabs[0].customEditorId).toBe('custom-editor-1')
})

<<<<<<< HEAD
test('saveState should handle items with unicode characters', () => {
  const uid = 18
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: 'Unicode: 🚀 中文 العربية' }],
    name: 'unicode',
    tooltip: 'Tooltip: 🎉',
  }
  const state: any = {
=======
test('saveState should save layout with tabs containing paths and languages', () => {
  const state: MainAreaState = {
>>>>>>> origin/main
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              content: 'console.log("hello");',
              editorType: 'text',
              id: 1,
              isDirty: false,
              language: 'javascript',
              path: '/path/to/script.js',
              title: 'script.js',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups[0].tabs[0].path).toBe('/path/to/script.js')
  expect(result.layout.groups[0].tabs[0].language).toBe('javascript')
})

<<<<<<< HEAD
test('saveState should handle items with long text values', () => {
  const uid = 19
  const longText = 'A'.repeat(1000)
  const longTooltip = 'B'.repeat(2000)
  const item: StatusBarItem = {
    elements: [{ type: 'text', value: longText }],
    name: 'long',
    tooltip: longTooltip,
  }
  const state: any = {
=======
test('saveState should save layout with undefined activeGroupId', () => {
  const state: MainAreaState = {
>>>>>>> origin/main
    ...createDefaultState(),
    layout: {
      activeGroupId: undefined,
      direction: 'horizontal',
      groups: [],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.activeGroupId).toBeUndefined()
  expect(result.layout.groups).toHaveLength(0)
})

test('saveState should save layout with empty groups', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          size: 100,
          tabs: [],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.groups).toHaveLength(1)
  expect(result.layout.groups[0].tabs).toHaveLength(0)
  expect(result.layout.groups[0].activeTabId).toBeUndefined()
})

test('saveState should return a new object, not mutate the original state', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [],
    },
  }
  const result: SavedState = saveState(state)
  expect(result).not.toBe(state)
  expect(result.layout).toBe(state.layout)
})

test('saveState should save layout with string activeGroupId', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 'group-1',
      direction: 'vertical',
      groups: [
        {
          activeTabId: 'tab-1',
          focused: true,
          id: 'group-1',
          size: 100,
          tabs: [
            {
              content: 'content',
              editorType: 'text',
              id: 'tab-1',
              isDirty: false,
              title: 'Tab',
            },
          ],
        },
      ],
    },
  }
  const result: SavedState = saveState(state)
  expect(result.layout.activeGroupId).toBe('group-1')
  expect(result.layout.groups[0].id).toBe('group-1')
  expect(result.layout.groups[0].activeTabId).toBe('tab-1')
  expect(result.layout.groups[0].tabs[0].id).toBe('tab-1')
})
