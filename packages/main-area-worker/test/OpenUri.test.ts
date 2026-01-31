import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../src/parts/OpenUriOptions/OpenUriOptions.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'

test('openUri should create a new group and tab when no groups exist', async () => {
  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.activeGroupId).toBeDefined()
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].uri).toBe('file:///path/to/file.ts')
  expect(result.layout.groups[0].tabs[0].title).toBe('file.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[0].id)
  expect(result.layout.groups[0].focused).toBe(true)
})

test('openUri should add tab to active group when group exists', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: ,
    isEmpty: false,,
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
              title: 'Existing File',
              uri: 'file:///existing/file',
            },
          ],
        },
      ],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/new/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].tabs[1].uri).toBe('file:///path/to/new/file.ts')
  expect(result.layout.groups[0].activeTabId).toBe(result.layout.groups[0].tabs[1].id)
})

test('openUri should activate existing tab if URI already exists', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: ,
    isEmpty: false,,
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
              title: 'Existing File',
              uri: 'file:///path/to/file.ts',
            },
            {
              editorType: 'text',
              editorUid: -1,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'Other File',
              uri: 'file:///path/to/other/file.ts',
            },
          ],
        },
      ],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(result.layout.groups[0].activeTabId).toBe(1)
})

test('openUri should activate existing tab in different group', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 1,
      direction: 'horizontal',
      groups: [
        {
          activeTabId: 1,
          focused: true,
          id: ,
    isEmpty: false,,
          size: 50,
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
              title: 'File 1',
              uri: 'file:///path/to/file1.ts',
            },
          ],
        },
        {
          activeTabId: 2,
          focused: false,
          id: ,
    isEmpty: false,,
          size: 50,
          tabs: [
            {
              editorType: 'text',
              editorUid: -1,
              errorMessage: '',
              icon: '',
              id: 2,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'File 2',
              uri: 'file:///path/to/file2.ts',
            },
          ],
        },
      ],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file2.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(2)
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[1].tabs.length).toBe(1)
  expect(result.layout.activeGroupId).toBe(2)
  expect(result.layout.groups[1].activeTabId).toBe(2)
  expect(result.layout.groups[1].focused).toBe(true)
})

test('openUri should create group when activeGroupId points to non-existent group', async () => {
  const state: MainAreaState = {
    ...createDefaultState(),
    layout: {
      activeGroupId: 999,
      direction: 'horizontal',
      groups: [],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups.length).toBe(1)
  expect(result.layout.activeGroupId).toBeDefined()
  expect(result.layout.groups[0].tabs.length).toBe(1)
  expect(result.layout.groups[0].tabs[0].uri).toBe('file:///path/to/file.ts')
})

test('openUri should validate state parameter', async () => {
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  await expect(openUri(null as any, options)).rejects.toThrow()
})

test('openUri should validate options parameter', async () => {
  const state: MainAreaState = createDefaultState()

  await expect(openUri(state, null as any)).rejects.toThrow()
})

// Tests for lines 45-85: viewlet creation, bounds calculation, and lifecycle management

test('openUri should calculate bounds with correct TAB_HEIGHT offset', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    height: 600,
    uid: 1,
    width: 800,
    x: 100,
    y: 200,
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)
  const tab = result.layout.groups[0].tabs[0]

  expect(result).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///path/to/file.ts'],
    ['Layout.createViewlet', 'editor.text', tab.editorUid, tab.id, { height: 565, width: 800, x: 100, y: 235 }, 'file:///path/to/file.ts'],
  ])
})

test('openUri should create viewlet for new tab', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)
  const tab = result.layout.groups[0].tabs[0]

  expect(result).toBeDefined()
  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///path/to/file.ts'],
    ['Layout.createViewlet', 'editor.text', tab.editorUid, tab.id, { height: -35, width: 0, x: 0, y: 35 }, 'file:///path/to/file.ts'],
  ])
})

test('openUri should not create viewlet when getViewletModuleId returns undefined', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.getModuleId': async () => undefined,
  })

  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(mockRpc.invocations).toEqual([['Layout.getModuleId', 'file:///path/to/file.ts']])
})

test('openUri should assign valid editorUid after viewlet creation', async () => {
  RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  // Verify that the tab has a valid editorUid assigned (not -1)
  const tab = result.layout.groups[0]?.tabs[0]
  expect(tab).toBeDefined()
  expect(tab.editorUid).not.toBe(-1)
  expect(typeof tab.editorUid).toBe('number')
})

test('openUri should pass correct parameters to createViewlet', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    height: 800,
    width: 1000,
    x: 50,
    y: 100,
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/test.js',
  }

  const result = await openUri(state, options)
  const tab = result.layout.groups[0].tabs[0]

  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///path/to/test.js'],
    ['Layout.createViewlet', 'editor.text', tab.editorUid, tab.id, { height: 765, width: 1000, x: 50, y: 135 }, 'file:///path/to/test.js'],
  ])
})

test('openUri should switch viewlet from previous tab to new tab', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
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
          id: ,
    isEmpty: false,,
          size: 100,
          tabs: [
            {
              editorType: 'text',
              editorUid: 5,
              errorMessage: '',
              icon: '',
              id: 1,
              isDirty: false,
              language: 'typescript',
              loadingState: 'idle',
              title: 'Existing File',
              uri: 'file:///existing/file.ts',
            },
          ],
        },
      ],
    },
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/new.ts',
  }

  const result = await openUri(state, options)
  const tab = result.layout.groups[0].tabs[1]

  expect(result).toBeDefined()
  expect(result.layout.groups[0].tabs.length).toBe(2)
  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///path/to/new.ts'],
    ['Layout.createViewlet', 'editor.text', tab.editorUid, tab.id, { height: -35, width: 0, x: 0, y: 35 }, 'file:///path/to/new.ts'],
  ])
})

test('openUri should handle bounds calculation with different main area dimensions', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    height: 1080,
    width: 1920,
    x: 0,
    y: 0,
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///large-screen.ts',
  }

  const result = await openUri(state, options)
  const tab = result.layout.groups[0].tabs[0]

  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///large-screen.ts'],
    ['Layout.createViewlet', 'editor.text', tab.editorUid, tab.id, { height: 1045, width: 1920, x: 0, y: 35 }, 'file:///large-screen.ts'],
  ])
})

test('openUri should use TAB_HEIGHT constant of 35 pixels', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.markdown',
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    height: 400,
    width: 500,
    x: 10,
    y: 50,
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///document.md',
  }

  const result = await openUri(state, options)
  const tab = result.layout.groups[0].tabs[0]

  expect(mockRpc.invocations).toEqual([
    ['Layout.getModuleId', 'file:///document.md'],
    ['Layout.createViewlet', 'editor.markdown', tab.editorUid, tab.id, { height: 365, width: 500, x: 10, y: 85 }, 'file:///document.md'],
  ])
})
test('openUri should load and set file icon for new tab', async () => {
  const { IconThemeWorker } = await import('@lvce-editor/rpc-registry')
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  using mockIconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-typescript'],
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  expect(result).toBeDefined()
  expect(result.layout.groups[0].tabs[0].icon).toBe('file-icon-typescript')
  expect(mockRpc.invocations).toContainEqual(['Layout.getModuleId', 'file:///path/to/file.ts'])
  expect(mockIconRpc.invocations).toContainEqual(['IconTheme.getIcons', expect.any(Array)])
})

test('openUri should update fileIconCache with loaded icon', async () => {
  const { IconThemeWorker } = await import('@lvce-editor/rpc-registry')
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  using mockIconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => ['file-icon-text'],
  })

  const state: MainAreaState = {
    ...createDefaultState(),
    fileIconCache: {},
  }
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.txt',
  }

  const result = await openUri(state, options)

  expect(result.fileIconCache['file:///path/to/file.txt']).toBe('file-icon-text')
  expect(mockRpc.invocations).toContainEqual(['Layout.getModuleId', 'file:///path/to/file.txt'])
  expect(mockIconRpc.invocations).toContainEqual(['IconTheme.getIcons', expect.any(Array)])
})

test('openUri should handle icon loading failure gracefully', async () => {
  const { IconThemeWorker } = await import('@lvce-editor/rpc-registry')
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
  })

  using mockIconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      throw new Error('Icon loading failed')
    },
  })

  const state: MainAreaState = createDefaultState()
  const options: OpenUriOptions = {
    focu: false,
    preview: false,
    uri: 'file:///path/to/file.ts',
  }

  const result = await openUri(state, options)

  // Should still return valid result even if icon loading fails
  expect(result).toBeDefined()
  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(result.layout.groups[0].tabs[0].uri).toBe('file:///path/to/file.ts')
  expect(mockRpc.invocations).toContainEqual(['Layout.getModuleId', 'file:///path/to/file.ts'])
  expect(mockIconRpc.invocations).toContainEqual(['IconTheme.getIcons', expect.any(Array)])
})
