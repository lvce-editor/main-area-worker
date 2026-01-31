import { expect, test } from '@jest/globals'
import type { MainAreaState, Tab } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetNextRequestId from '../src/parts/GetNextRequestId/GetNextRequestId.ts'
import * as ViewletLifecycle from '../src/parts/ViewletLifecycle/ViewletLifecycle.ts'

const createStateWithTab = (tabOverrides: Partial<Tab> = {}): MainAreaState => ({
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
            editorType: 'text',
            editorUid: -1,
            errorMessage: '',
            icon: '',
            id: 1,
            isDirty: false,
            language: 'typescript',
            loadingState: 'idle',
            title: 'file.txt',
            uri: '/test/file.txt',
            ...tabOverrides,
          },
        ],
      },
    ],
  },
  uid: 1,
})

test('createViewletForTab creates viewlet command for idle tab', () => {
  GetNextRequestId.resetRequestIdCounter()
  const state = createStateWithTab()
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result).not.toBe(state)
  expect(result.layout.groups[0].tabs[0].editorUid).toBeDefined()
})

test('createViewletForTab returns empty commands for tab already creating', () => {
  const state = createStateWithTab({ loadingState: 'loading' })
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result).toBe(state)
})

test('createViewletForTab returns empty commands for tab already ready', () => {
  const state = createStateWithTab({ loadingState: 'loaded' })
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result).toBe(state)
})

test('createViewletForTab returns empty commands for non-existent tab', () => {
  const state = createStateWithTab()
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 999, 'EditorText', bounds)

  expect(result).toBe(state)
})

test('switchViewlet with reference nodes - no attach/detach commands', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: 101,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.switchViewlet(state, 1, 2)

  // Reference nodes handle attachment automatically - no commands needed
  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('switchViewlet with not-ready tab - still no attach/detach commands', () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: 101,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.switchViewlet(state, 1, 2)

  // Reference nodes handle it - only reference nodes for ready viewlets are rendered
  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('switchViewlet handles undefined fromTabId - no commands', () => {
  const state = createStateWithTab()
  const result = ViewletLifecycle.switchViewlet(state, undefined, 1)

  // Reference nodes handle attachment automatically
  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('handleViewletReady marks viewlet as ready without attach command', () => {
  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

  const state: MainAreaState = {
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
              editorType: 'text',
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file.txt',
              uri: '/test/file.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.handleViewletReady(state, requestId)

  // Reference nodes handle attachment - no attach command needed
  expect(result).toBe(state)
})

test('handleViewletReady works regardless of active tab - reference nodes render correctly', () => {
  GetNextRequestId.resetRequestIdCounter()
  const requestId = GetNextRequestId.getNextRequestId()

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 2, // Tab 2 is active, not tab 1
          focused: true,
          id: 1,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 100,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file1.txt',
              uri: '/test/file1.txt',
            },
            {
              editorType: 'text',
              editorUid: 101,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'file2.txt',
              uri: '/test/file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.handleViewletReady(state, requestId)

  // Reference nodes render correctly regardless of active tab
  // Race condition is avoided: only active tab's reference node will be in virtual DOM
  expect(result).toBe(state)
})

test('handleViewletReady disposes viewlet when tab no longer exists', () => {
  const state = createStateWithTab()

  const result = ViewletLifecycle.handleViewletReady(state, 999)

  expect(result).toBe(state)
})

test('disposeViewletForTab creates dispose command for tab with viewlet', () => {
  const state = createStateWithTab({ editorUid: 100 })
  const result = ViewletLifecycle.disposeViewletForTab(state, 1)

  expect(result.commands).toHaveLength(1)
  expect(result.commands[0].type).toBe('dispose')
})

test('disposeViewletForTab returns empty commands for tab without viewlet', () => {
  const state = createStateWithTab()

  const result = ViewletLifecycle.disposeViewletForTab(state, 1)

  expect(result.commands).toHaveLength(0)
})

test('disposeViewletForTab returns empty commands for non-existent tab', () => {
  const state = createStateWithTab()

  const result = ViewletLifecycle.disposeViewletForTab(state, 999)

  expect(result.commands).toHaveLength(0)
})
