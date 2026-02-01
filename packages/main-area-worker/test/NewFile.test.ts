import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { newFile } from '../src/parts/NewFile/NewFile.ts'

test('newFile should create a new empty tab in the active group', async () => {
  // @ts-ignore
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

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
              language: 'javascript',
              loadingState: 'loaded',
              title: 'test.js',
              uri: 'file:///test.js',
            },
          ],
        },
      ],
    },
  }

  const result = await newFile(state)

  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs[1].title).toBe('Untitled')
  expect(result.layout.groups[0].tabs[1].editorType).toBe('text')
  expect(result.layout.groups[0].tabs[1].isDirty).toBe(false)
  expect(result.layout.groups[0].tabs[1].language).not.toBeUndefined()
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[1].id)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('newFile should create a new group if no active group exists', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

  const state: MainAreaState = createDefaultState()

  const result = await newFile(state)

  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].title).toBe('Untitled')
  expect(result.layout.groups[0].tabs[0].editorType).toBe('text')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[0].id)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('newFile should preserve existing tabs when creating new tab', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

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
              language: 'javascript',
              loadingState: 'loaded',
              title: 'file1.js',
              uri: 'file:///file1.js',
            },
            {
              editorType: 'text',
              editorUid: -1,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              language: 'typescript',
              loadingState: 'loaded',
              title: 'file2.ts',
              uri: 'file:///file2.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await newFile(state)

  expect(result.layout.groups[0].tabs.length).toBe(3)
  expect(result.layout.groups[0].tabs[0].title).toBe('file1.js')
  expect(result.layout.groups[0].tabs[1].title).toBe('file2.ts')
  expect(result.layout.groups[0].tabs[2].title).toBe('Untitled')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[2].id)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('newFile should create a new tab with unique ID', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

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
              language: 'plaintext',
              loadingState: 'idle',
              title: 'Untitled',
            },
          ],
        },
      ],
    },
  }

  const result = await newFile(state)

  expect(result.layout.groups[0].tabs[0].id).not.toBe(result.layout.groups[0].tabs[1].id)
  expect(result.layout.groups[0].tabs[1].id).toBeGreaterThan(0)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})

test('newFile should set active group to the group where tab was created', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })

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
              language: 'plaintext',
              loadingState: 'idle',
              title: 'test.txt',
            },
          ],
        },
      ],
    },
  }

  const result = await newFile(state)

  expect(result.layout.activeGroupId).toBe(1)
  expect(mockRpc.invocations.length).toBeGreaterThan(0)
})
