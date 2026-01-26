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
            content: '',
            editorUid: 100,
            editorType: 'text' as const,
            id: 1,
            isDirty: false,
            path: '/test/file.txt',
            title: 'file.txt',
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

  expect(result.commands).toHaveLength(1)
  expect(result.commands[0].type).toBe('create')
  expect(result.newState.layout.groups[0].tabs[0].viewletState).toBe('creating')
  expect(result.newState.layout.groups[0].tabs[0].viewletRequestId).toBe(1)
})

test('createViewletForTab returns empty commands for tab already creating', () => {
  const state = createStateWithTab({ viewletState: 'creating' })
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('createViewletForTab returns empty commands for tab already ready', () => {
  const state = createStateWithTab({ viewletInstanceId: 123, viewletState: 'ready' })
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 1, 'EditorText', bounds)

  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('createViewletForTab returns empty commands for non-existent tab', () => {
  const state = createStateWithTab()
  const bounds = { height: 600, width: 800, x: 0, y: 0 }

  const result = ViewletLifecycle.createViewletForTab(state, 999, 'EditorText', bounds)

  expect(result.commands).toHaveLength(0)
  expect(result.newState).toBe(state)
})

test('switchViewlet detaches old viewlet and attaches new one', () => {
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
              content: '',
              editorUid: 100,
              editorType: 'text' as const,
              id: 1,
              isAttached: true,
              isDirty: false,
              path: '/test/file1.txt',
              title: 'file1.txt',
              viewletInstanceId: 100,
              viewletState: 'ready',
            },
            {
              content: '',
              editorUid: 101,
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              path: '/test/file2.txt',
              title: 'file2.txt',
              viewletInstanceId: 200,
              viewletState: 'ready',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.switchViewlet(state, 1, 2)

  expect(result.commands).toHaveLength(2)
  expect(result.commands[0].type).toBe('detach')
  expect(result.commands[1].type).toBe('attach')
  expect(result.newState.layout.groups[0].tabs[0].isAttached).toBe(false)
  expect(result.newState.layout.groups[0].tabs[1].isAttached).toBe(true)
})

test('switchViewlet only attaches when new tab is ready', () => {
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
              content: '',
              editorUid: 100,
              editorType: 'text' as const,
              id: 1,
              isAttached: true,
              isDirty: false,
              path: '/test/file1.txt',
              title: 'file1.txt',
              viewletInstanceId: 100,
              viewletState: 'ready',
            },
            {
              content: '',
              editorUid: 101,
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              path: '/test/file2.txt',
              title: 'file2.txt',
              viewletState: 'creating', // Not ready yet
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.switchViewlet(state, 1, 2)

  expect(result.commands).toHaveLength(1)
  expect(result.commands[0].type).toBe('detach')
  expect(result.newState.layout.groups[0].tabs[0].isAttached).toBe(false)
})

test('switchViewlet handles undefined fromTabId', () => {
  const state = createStateWithTab({ viewletInstanceId: 100, viewletState: 'ready' })

  const result = ViewletLifecycle.switchViewlet(state, undefined, 1)

  expect(result.commands).toHaveLength(1)
  expect(result.commands[0].type).toBe('attach')
  expect(result.newState.layout.groups[0].tabs[0].isAttached).toBe(true)
})

test('handleViewletReady attaches viewlet when tab is active', () => {
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
              content: '',
              editorUid: 100,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              path: '/test/file.txt',
              title: 'file.txt',
              viewletRequestId: requestId,
              viewletState: 'creating',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.handleViewletReady(state, requestId, 123)

  expect(result.commands).toHaveLength(1)
  expect(result.commands[0].type).toBe('attach')
  expect(result.newState.layout.groups[0].tabs[0].viewletInstanceId).toBe(123)
  expect(result.newState.layout.groups[0].tabs[0].viewletState).toBe('ready')
  expect(result.newState.layout.groups[0].tabs[0].isAttached).toBe(true)
})

test('handleViewletReady does not attach when tab is not active (race condition)', () => {
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
              content: '',
              editorUid: 100,
              editorType: 'text' as const,
              id: 1,
              isDirty: false,
              path: '/test/file1.txt',
              title: 'file1.txt',
              viewletRequestId: requestId,
              viewletState: 'creating',
            },
            {
              content: '',
              editorUid: 101,
              editorType: 'text' as const,
              id: 2,
              isDirty: false,
              path: '/test/file2.txt',
              title: 'file2.txt',
            },
          ],
        },
      ],
    },
    uid: 1,
  }

  const result = ViewletLifecycle.handleViewletReady(state, requestId, 123)

  // Should update state but NOT attach (no commands)
  expect(result.commands).toHaveLength(0)
  expect(result.newState.layout.groups[0].tabs[0].viewletInstanceId).toBe(123)
  expect(result.newState.layout.groups[0].tabs[0].viewletState).toBe('ready')
  expect(result.newState.layout.groups[0].tabs[0].isAttached).toBeUndefined()
})

test('handleViewletReady disposes viewlet when tab no longer exists', () => {
  const state = createStateWithTab()

  const result = ViewletLifecycle.handleViewletReady(state, 999, 123)

  expect(result.commands).toHaveLength(1)
  expect(result.commands[0].type).toBe('dispose')
  expect(result.newState).toBe(state)
})

test('disposeViewletForTab creates dispose command for tab with viewlet', () => {
  const state = createStateWithTab({ viewletInstanceId: 123, viewletState: 'ready' })

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
