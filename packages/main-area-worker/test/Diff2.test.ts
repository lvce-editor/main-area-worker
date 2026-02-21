import { expect, test } from '@jest/globals'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'

test('diff2 - should return empty array when states are equal', () => {
  const uid = 1
  const state: MainAreaState = createDefaultState()
  MainAreaStates.set(uid, state, state)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderCss])
})

test('diff2 - should return RenderItems when groups differ', () => {
  const uid = 2
  const oldState: MainAreaState = createDefaultState()
  const newState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
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
    },
  }
  MainAreaStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})

test('diff2 - should return RenderItems when tabs differ', () => {
  const uid = 3
  const oldState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
          ],
        },
      ],
    },
  }
  const newState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: 'test-icon',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: 'test-icon',
              id: 2,
              isDirty: false,
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
  }
  MainAreaStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})

test('diff2 - should return empty array when only uid differs', () => {
  const uid = 4
  const oldState: MainAreaState = {
    ...createDefaultState(),
    uid: 1,
  }
  const newState: MainAreaState = {
    ...oldState,
    uid: 2,
  }
  MainAreaStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderCss])
})

test('diff2 - should return RenderItems when active tab changes', () => {
  const uid = 5
  const oldState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: 1,
          focused: false,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              icon: 'test-icon',
              id: 1,
              isDirty: false,
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: -1,
              icon: 'test-icon',
              id: 2,
              isDirty: false,
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
  }
  const newState: MainAreaState = {
    ...oldState,
    layout: {
      ...oldState.layout,
      groups: [
        {
          ...oldState.layout.groups[0],
          activeTabId: 2,
        },
      ],
    },
  }
  MainAreaStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})

test('diff2 - should return RenderItems when group focus changes', () => {
  const uid = 6
  const oldState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
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
    },
  }
  const newState: MainAreaState = {
    ...oldState,
    layout: {
      ...oldState.layout,
      groups: [
        {
          ...oldState.layout.groups[0],
          focused: true,
        },
      ],
    },
  }
  MainAreaStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})

test('diff2 - should return RenderItems when group sizes change', () => {
  const uid = 7
  const oldState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
  }
  const newState: MainAreaState = {
    ...oldState,
    layout: {
      ...oldState.layout,
      groups: [
        {
          ...oldState.layout.groups[0],
          size: 60,
        },
        {
          ...oldState.layout.groups[1],
          size: 40,
        },
      ],
    },
  }
  MainAreaStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])
})

test('diff2 - should return RenderItems when number of groups changes', () => {
  const uid = 8
  const oldState: MainAreaState = {
    ...createDefaultState(),
    layout: {
      ...createDefaultState().layout,
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
    },
  }
  const newState: MainAreaState = {
    ...oldState,
    layout: {
      ...oldState.layout,
      groups: [
        {
          activeTabId: undefined,
          focused: false,
          id: 1,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
        {
          activeTabId: undefined,
          focused: false,
          id: 2,
          isEmpty: true,
          size: 50,
          tabs: [],
        },
      ],
    },
  }
  MainAreaStates.set(uid, oldState, newState)
  const result = Diff2.diff2(uid)
  expect(result).toEqual([DiffType.RenderIncremental, DiffType.RenderCss])})