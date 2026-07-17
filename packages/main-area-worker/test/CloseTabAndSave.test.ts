import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeTabAndSave } from '../src/parts/CloseTabAndSave/CloseTabAndSave.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'

afterEach(() => {
  const defaultState = createDefaultState()
  MainAreaStates.set(0, defaultState, defaultState)
})

test('closeTabAndSave should save a dirty tab before closing it', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt': async () => true,
    'Editor.save': async () => ({ modified: false }),
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.dispose': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              editorUid: 123,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              language: 'typescript',
              loadingState: 'loaded',
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt',
      'Do you want to save the changes you made to test.ts?',
      { cancelMessage: 'More Options', confirmMessage: 'Save', title: 'Save Changes' },
    ],
    ['Editor.save', 123],
    ['Main.handleModifiedStatusChange', 'file:///test.ts', false],
    ['Viewlet.dispose', 123],
  ])
  expect(result.layout.groups).toHaveLength(0)
})

test('closeTabAndSave should save an editor-backed tab before closing it', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt': async () => true,
    'Editor.save': async () => ({ modified: false }),
    'Main.handleModifiedStatusChange': async () => undefined,
    'Viewlet.dispose': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              editorUid: 123,
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt',
      'Do you want to save the changes you made to test.ts?',
      { cancelMessage: 'More Options', confirmMessage: 'Save', title: 'Save Changes' },
    ],
    ['Editor.save', 123],
    ['Main.handleModifiedStatusChange', 'file:///test.ts', false],
    ['Viewlet.dispose', 123],
  ])
  expect(result.layout.groups).toHaveLength(0)
})

test('closeTabAndSave should keep a modified untitled tab open when saving is canceled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt': async () => true,
    'Editor.save': async () => ({ modified: true }),
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              editorUid: 123,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              language: 'plaintext',
              loadingState: 'loaded',
              title: 'Untitled',
              uri: 'untitled:///1',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt',
      'Do you want to save the changes you made to Untitled?',
      { cancelMessage: 'More Options', confirmMessage: 'Save', title: 'Save Changes' },
    ],
    ['Editor.save', 123],
  ])
  expect(result).toBe(state)
})

test('closeTabAndSave should keep a dirty tab open when saving fails', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt': async () => true,
    'Editor.save': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              editorUid: 123,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              language: 'typescript',
              loadingState: 'loaded',
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt',
      'Do you want to save the changes you made to test.ts?',
      { cancelMessage: 'More Options', confirmMessage: 'Save', title: 'Save Changes' },
    ],
    ['Editor.save', 123],
  ])
  expect(result).toBe(state)
})

test('closeTabAndSave should keep a dirty tab open when closing is canceled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt': async () => false,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              editorUid: 123,
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt',
      'Do you want to save the changes you made to test.ts?',
      { cancelMessage: 'More Options', confirmMessage: 'Save', title: 'Save Changes' },
    ],
    [
      'ConfirmPrompt.prompt',
      'Discard the changes you made to test.ts?',
      { cancelMessage: 'Cancel', confirmMessage: "Don't Save", title: 'Save Changes' },
    ],
  ])
  expect(result).toBe(state)
})

test('closeTabAndSave should close a dirty tab without saving when changes are discarded', async () => {
  let promptCount = 0
  using mockRpc = RendererWorker.registerMockRpc({
    'ConfirmPrompt.prompt': async () => {
      promptCount++
      return promptCount === 2
    },
    'Viewlet.dispose': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              editorUid: 123,
              icon: '',
              id: 1,
              isDirty: true,
              isPreview: false,
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([
    [
      'ConfirmPrompt.prompt',
      'Do you want to save the changes you made to test.ts?',
      { cancelMessage: 'More Options', confirmMessage: 'Save', title: 'Save Changes' },
    ],
    [
      'ConfirmPrompt.prompt',
      'Discard the changes you made to test.ts?',
      { cancelMessage: 'Cancel', confirmMessage: "Don't Save", title: 'Save Changes' },
    ],
    ['Viewlet.dispose', 123],
  ])
  expect(result.layout.groups).toHaveLength(0)
})

test('closeTabAndSave should skip saving tabs without editor instances', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Editor.save': async () => ({ modified: false }),
    'Main.handleModifiedStatusChange': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
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
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'test.ts',
              uri: 'file:///test.ts',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 1)

  expect(mockRpc.invocations).toEqual([])
  expect(result.layout.groups).toHaveLength(0)
})

test('closeTabAndSave should dispose a Settings editor after switching to the replacement editor', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.dispose': async () => undefined,
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 1,
      groups: [
        {
          activeTabId: 2,
          focused: true,
          id: 1,
          isEmpty: false,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 122,
              icon: '',
              id: 1,
              isDirty: false,
              isPreview: false,
              title: 'workspace-file.txt',
              uri: 'file:///workspace-file.txt',
            },
            {
              editorType: 'text',
              editorUid: 123,
              icon: '',
              id: 2,
              isDirty: false,
              isPreview: false,
              title: 'settings.json',
              uri: 'app://settings.json',
            },
          ],
        },
      ],
    },
  }

  const result = await closeTabAndSave(state, 1, 2)

  expect(result.layout.groups[0].activeTabId).toBe(1)
  expect(result.pendingViewletDisposal).toBe(123)
  expect(result.pendingViewletFocus).toBe(122)
  expect(mockRpc.invocations).toEqual([])
})
