import { expect, test } from '@jest/globals'
import { IconThemeWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { loadContentShell as loadContent } from '../src/parts/LoadContent/LoadContentShell.ts'

const rpcCommands = {
  'Layout.handleActiveEditorChange': async () => {},
  'Layout.renderMainAreaPending': async () => {},
  'Layout.setMountedViewlets': async () => {},
  'Viewlet.dispose': async () => {},
  'Viewlet.getTitle': async () => '',
  'Workspace.getHomeDir': async () => '',
}

const savedState = {
  layout: {
    activeGroupId: 101,
    direction: 1,
    groups: [
      {
        activeTabId: 102,
        direction: 1,
        id: 101,
        isEmpty: false,
        isFocused: true,
        size: 100,
        tabs: [{ editorUid: -1, icon: '', id: 102, isDirty: false, isPreview: false, title: 'slow.txt', uri: 'file:///slow.txt' }],
      },
    ],
  },
}

test('restored tabs and loading content are ready without waiting for editor content', () => {
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': () => new Promise(() => {}),
    'Layout.getModuleId': async () => 'EditorText',
  })
  const result = loadContent(createDefaultState(), savedState)
  expect(result.layout.groups[0].tabs[0].title).toBe('slow.txt')
  expect(result.layout.groups[0].tabs[0].loadingState).toBe('loading')
  expect(rpc.invocations).toEqual([])
})

import { beforeEach } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import { getMainAreaVirtualDom } from '../src/parts/GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'
import { clear, get, registerCommands, set } from '../src/parts/MainAreaStates/MainAreaStates.ts'

beforeEach(() => {
  clear()
  registerCommands(commandMap)
})

const createShell = (): void => {
  const state = { ...createDefaultState(), uid: 91 }
  set(91, state, state)
  commandMap['MainArea.loadContentShell'](91, savedState)
}

test('the discovered deferred hook is inert for renderers using legacy content loading', async () => {
  using rpc = RendererWorker.registerMockRpc(rpcCommands)
  const state = { ...createDefaultState(), uid: 91 }
  set(91, state, state)
  await commandMap['MainArea.loadContentLater'](91)
  expect(get(91).newState).toBe(state)
  expect(rpc.invocations).toEqual([])
  expect(commandMap['MainArea.getCommandIds']()).not.toContain('loadContentLater')
})

const waitForCreate = async (rpc: { invocations: readonly (readonly unknown[])[] }): Promise<void> => {
  for (let i = 0; i < 30; i++) {
    if (rpc.invocations.some(([method]) => method === 'Layout.createViewlet')) {
      return
    }
    await Promise.resolve()
  }
  throw new Error('Restore did not request editor creation')
}

test('shell renders restored tabs and the loading message even when workspace lookup hangs', async () => {
  using rpc = RendererWorker.registerMockRpc({ 'Workspace.getHomeDir': () => new Promise(() => {}) })
  createShell()
  const state = get(91).newState
  expect(getMainAreaVirtualDom(state.layout)).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'Loading...' })]))
  expect(rpc.invocations).toEqual([])
})

test('opening another file while restoration is pending retains the new selection and both tabs', async () => {
  const content = Promise.withResolvers<void>()
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': (...args: readonly unknown[]) => (args[4] === 'file:///slow.txt' ? content.promise : undefined),
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await waitForCreate(rpc)
  await commandMap['MainArea.openUri'](91, 'file:///new.txt', false)
  const selectedTabId = get(91).newState.layout.groups[0].activeTabId
  expect(selectedTabId).not.toBe(102)
  content.resolve()
  await restoration
  const group = get(91).newState.layout.groups[0]
  expect(group.activeTabId).toBe(selectedTabId)
  expect(group.tabs.map((tab) => tab.uri)).toEqual(['file:///slow.txt', 'file:///new.txt'])
  expect(group.tabs[0].loadingState).toBe('loaded')
})

test('closing a pending restored tab disposes its late completion without resurrecting it', async () => {
  const content = Promise.withResolvers<void>()
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': () => content.promise,
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  const { editorUid } = get(91).newState.layout.groups[0].tabs[0]
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await waitForCreate(rpc)
  await commandMap['MainArea.closeAll'](91)
  content.resolve()
  await restoration
  expect(get(91).newState.layout.groups.flatMap((group) => group.tabs)).toEqual([])
  expect(rpc.invocations).toContainEqual(['Viewlet.dispose', editorUid])
})

test('a rejected restored editor displays its error and can be retried by opening its URI', async () => {
  let rejectRestore = true
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': async () => {
      if (rejectRestore) {
        throw new Error('File is unavailable')
      }
    },
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  await commandMap['MainArea.loadContentLater'](91)
  expect(get(91).newState.layout.groups[0].tabs[0]).toMatchObject({ errorMessage: 'File is unavailable', loadingState: 'error' })
  expect(rpc.invocations).toContainEqual(['Layout.getModuleId', 'file:///slow.txt'])
  rejectRestore = false
  await commandMap['MainArea.openUri'](91, 'file:///slow.txt', false)
  expect(get(91).newState.layout.groups[0].tabs[0].loadingState).toBe('loaded')
})

test('a disposed registry instance is not recreated by delayed restoration', async () => {
  const content = Promise.withResolvers<void>()
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': () => content.promise,
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await waitForCreate(rpc)
  await commandMap['MainArea.dispose'](91)
  content.resolve()
  await restoration
  expect(get(91)).toBeUndefined()
})

test('a replaced registry instance is not overwritten by an older restore', async () => {
  const content = Promise.withResolvers<void>()
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': () => content.promise,
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await waitForCreate(rpc)
  clear()
  const replacement = { ...createDefaultState(), uid: 91 }
  set(91, replacement, replacement)
  content.resolve()
  await restoration
  expect(get(91).newState).toBe(replacement)
})

test('split groups restore independently while an optional workspace lookup is pending', async () => {
  const slowContent = Promise.withResolvers<void>()
  const homeDir = Promise.withResolvers<string>()
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': (...args: readonly unknown[]) => (args[4] === 'file:///slow.txt' ? slowContent.promise : undefined),
    'Layout.getModuleId': async () => 'EditorText',
    'Viewlet.getTitle': async () => 'restored title',
    'Workspace.getHomeDir': () => homeDir.promise,
  })
  const state = { ...createDefaultState(), uid: 91 }
  set(91, state, state)
  const firstGroup = savedState.layout.groups[0]
  commandMap['MainArea.loadContentShell'](91, {
    layout: {
      activeGroupId: 201,
      direction: 2,
      groups: [
        firstGroup,
        {
          ...firstGroup,
          activeTabId: 202,
          id: 201,
          isFocused: false,
          size: 50,
          tabs: [{ ...firstGroup.tabs[0], id: 202, title: 'fast.txt', uri: 'file:///fast.txt' }],
        },
      ],
    },
  })
  const restoration = commandMap['MainArea.loadContentLater'](91)
  for (let i = 0; i < 100 && get(91).newState.layout.groups[1].tabs[0].loadingState !== 'loaded'; i++) {
    await Promise.resolve()
  }
  expect(get(91).newState.layout.groups[1].tabs[0].loadingState).toBe('loaded')
  expect(get(91).newState.layout.groups[0].tabs[0].loadingState).toBe('loading')
  homeDir.resolve('/home/user')
  slowContent.resolve()
  await restoration
  expect(get(91).newState.layout.direction).toBe(2)
  expect(get(91).newState.layout.activeGroupId).toBe(201)
  expect(get(91).newState.layout.groups[1].tabs[0].title).toBe('restored title')
  expect(rpc.invocations).toContainEqual(['Workspace.getHomeDir'])
})

test('unsupported restored editor types leave an error instead of permanently loading', async () => {
  using rpc = RendererWorker.registerMockRpc({ ...rpcCommands, 'Layout.getModuleId': async () => undefined })
  createShell()
  await commandMap['MainArea.loadContentLater'](91)
  expect(get(91).newState.layout.groups[0].tabs[0]).toMatchObject({ editorUid: -1, loadingState: 'error' })
  expect(rpc.invocations.some(([command]) => command === 'Layout.createViewlet')).toBe(false)
})

test('closing a tab during module resolution does not start content creation', async () => {
  const moduleId = Promise.withResolvers<string>()
  using rpc = RendererWorker.registerMockRpc({ ...rpcCommands, 'Layout.getModuleId': () => moduleId.promise })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await commandMap['MainArea.closeAll'](91)
  moduleId.resolve('EditorText')
  await restoration
  expect(rpc.invocations.some(([command]) => command === 'Layout.createViewlet')).toBe(false)
})

test('the shell preserves inactive and binary tabs without starting editors for them', () => {
  const group = savedState.layout.groups[0]
  const state = loadContent(createDefaultState(), {
    layout: {
      ...savedState.layout,
      groups: [
        {
          ...group,
          tabs: [
            { ...group.tabs[0], uri: 'file:///archive.zip' },
            { ...group.tabs[0], id: 103, title: 'inactive.txt', uri: 'file:///inactive.txt' },
          ],
        },
      ],
    },
  })
  expect(state.layout.groups[0].tabs[0]).toMatchObject({ editorUid: -1, loadingState: 'binary' })
  expect(state.layout.groups[0].tabs[1].editorUid).toBe(-1)
  expect(loadContent(createDefaultState(), undefined).layout.groups).toEqual([])
})

test('delayed metadata cannot publish state after the main area is disposed', async () => {
  const homeDir = Promise.withResolvers<string>()
  const icons = Promise.withResolvers<string[]>()
  using renderer = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'EditorText',
    'Workspace.getHomeDir': () => homeDir.promise,
  })
  using iconRpc = IconThemeWorker.registerMockRpc({ 'IconTheme.getIcons': () => icons.promise })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await waitForCreate(renderer)
  await commandMap['MainArea.dispose'](91)
  homeDir.resolve('/home/user')
  icons.resolve(['delayed-icon'])
  await restoration
  expect(get(91)).toBeUndefined()
  expect(iconRpc.invocations).toHaveLength(1)
  // Disposal is idempotent, including when metadata is still completing.
  await commandMap['MainArea.dispose'](91)
})

test('late title lookup cannot restore a closed tab', async () => {
  const title = Promise.withResolvers<string>()
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'EditorText',
    'Viewlet.getTitle': () => title.promise,
  })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  for (let i = 0; i < 100 && rpc.invocations.every(([command]) => command !== 'Viewlet.getTitle'); i++) {
    await Promise.resolve()
  }
  expect(get(91).newState.layout.groups[0].tabs[0].loadingState).toBe('loaded')
  await commandMap['MainArea.closeAll'](91)
  title.resolve('obsolete title')
  await restoration
  expect(get(91).newState.layout.groups.flatMap((group) => group.tabs)).toEqual([])
})

test('a late rejection after closing the tab does not restore an error tab', async () => {
  const content = Promise.withResolvers<void>()
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': () => content.promise,
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await waitForCreate(rpc)
  await commandMap['MainArea.closeAll'](91)
  content.reject(new Error('Late failure'))
  await restoration
  expect(get(91).newState.layout.groups.flatMap((group) => group.tabs)).toEqual([])
})

test('non-Error failures during restoration show a useful error', async () => {
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': async () => {
      throw null
    },
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  await commandMap['MainArea.loadContentLater'](91)
  expect(get(91).newState.layout.groups[0].tabs[0].errorMessage).toBe('Failed to restore editor')
  expect(rpc.invocations.some(([command]) => command === 'Viewlet.getTitle')).toBe(false)
})

test('delayed icons preserve files and selection opened after restoration started', async () => {
  const icons = Promise.withResolvers<string[]>()
  using renderer = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'EditorText',
  })
  using iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': (...args: readonly any[]) => (args[0][0].name === 'slow.txt' ? icons.promise : ['new-icon']),
  })
  createShell()
  const restoration = commandMap['MainArea.loadContentLater'](91)
  await waitForCreate(renderer)
  await commandMap['MainArea.openUri'](91, 'file:///new.txt', false)
  const selectedId = get(91).newState.layout.groups[0].activeTabId
  icons.resolve(['restored-icon'])
  await restoration
  const group = get(91).newState.layout.groups[0]
  expect(group.activeTabId).toBe(selectedId)
  expect(group.tabs[0].icon).toBe('restored-icon')
  expect(group.tabs[1].icon).toBe('new-icon')
  expect(iconRpc.invocations).toHaveLength(2)
})

test('opening a file before deferred restoration starts still loads the restored tab once', async () => {
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'EditorText',
  })
  createShell()
  await commandMap['MainArea.openUri'](91, 'file:///new.txt', false)
  const selectedId = get(91).newState.layout.groups[0].activeTabId
  await commandMap['MainArea.loadContentLater'](91)
  await commandMap['MainArea.loadContentLater'](91)
  const group = get(91).newState.layout.groups[0]
  expect(group.activeTabId).toBe(selectedId)
  expect(group.tabs[0].loadingState).toBe('loaded')
  expect(rpc.invocations.filter((invocation) => invocation[0] === 'Layout.createViewlet' && invocation[5] === 'file:///slow.txt')).toHaveLength(1)
})

test('disposal during readiness notification prevents rendering the disposed main area', async () => {
  using rpc = RendererWorker.registerMockRpc({
    ...rpcCommands,
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'EditorText',
    'Layout.setMountedViewlets': async () => {
      clear()
    },
  })
  createShell()
  await commandMap['MainArea.loadContentLater'](91)
  expect(get(91)).toBeUndefined()
  expect(rpc.invocations).toContainEqual(['Layout.getModuleId', 'file:///slow.txt'])
})
