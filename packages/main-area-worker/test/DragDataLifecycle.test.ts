import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import { handleClickTab } from '../src/parts/HandleClickTab/HandleClickTab.ts'
import { handleDragStart } from '../src/parts/HandleDragStart/HandleDragStart.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import { resetPointerDown } from '../src/parts/ResetPointerDown/ResetPointerDown.ts'

const createState = (): MainAreaState => {
  return {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 1,
          direction: 1,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 1,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              loadingState: 'loaded',
              title: 'file.txt',
              uri: '/workspace/file.txt',
            },
          ],
        },
      ],
    },
    uid: 42,
  }
}

test('mouse down renders drag data and mouse up rearms repeated drags', async () => {
  const initialState = createState()
  MainAreaStates.set(initialState.uid, initialState, initialState)

  const pointerDownState = await handleClickTab(initialState, '0', '0')
  MainAreaStates.set(initialState.uid, initialState, pointerDownState)
  const firstCommands = Render2.render2(initialState.uid, Diff2.diff2(initialState.uid))

  const pointerUpState = resetPointerDown(pointerDownState)
  MainAreaStates.set(initialState.uid, pointerDownState, pointerUpState)
  const pointerUpCommands = Render2.render2(initialState.uid, Diff2.diff2(initialState.uid))

  const secondPointerDownState = await handleClickTab(pointerUpState, '0', '0')
  MainAreaStates.set(initialState.uid, pointerUpState, secondPointerDownState)
  const secondCommands = Render2.render2(initialState.uid, Diff2.diff2(initialState.uid))

  const expectedCommand = [
    'Viewlet.setDragData',
    initialState.uid,
    {
      items: [
        { data: 'file:///workspace/file.txt', type: 'text/uri-list' },
        { data: 'file:///workspace/file.txt', type: 'text/plain' },
      ],
      label: 'file.txt',
    },
  ]
  expect(firstCommands).toContainEqual(expectedCommand)
  expect(pointerUpCommands).not.toContainEqual(expect.arrayContaining(['Viewlet.setDragData']))
  expect(secondCommands).toContainEqual(expectedCommand)
})

test('resetPointerDown should return unchanged idle state', () => {
  const state = createDefaultState()

  expect(resetPointerDown(state)).toBe(state)
})

test('resetPointerDown should clear all drag feedback', () => {
  const state: MainAreaState = {
    ...createState(),
    dragOverlay: { height: 100, width: 100, x: 0, y: 35 },
    pointerDownGroupIndex: 0,
    pointerDownTabIndex: 0,
    tabDropIndicator: { groupId: 1, index: 0 },
  }

  expect(resetPointerDown(state)).toEqual({
    ...state,
    dragOverlay: undefined,
    pointerDownGroupIndex: -1,
    pointerDownTabIndex: -1,
    tabDropIndicator: undefined,
  })
})

test('handleDragStart should preserve the staged drag state', () => {
  const state = createState()

  expect(handleDragStart(state)).toBe(state)
})
