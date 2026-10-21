import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { expect, test } from '@jest/globals'
import { IconThemeWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../src/parts/MainAreaState/MainAreaState.ts'
import { closeTab } from '../src/parts/CloseTab/CloseTab.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openInputWithContext } from '../src/parts/OpenInput/OpenInput.ts'
import { renderTab } from '../src/parts/RenderTab/RenderTab.ts'

const createContext = (): { context: AsyncCommandContext<MainAreaState>; published: MainAreaState[] } => {
  let state = createDefaultState()
  const published: MainAreaState[] = []
  return {
    context: {
      getState: () => state,
      updateState: async (updater) => {
        state = updater(state)
        published.push(state)
        return state
      },
    },
    published,
  }
}

const options = (file: string) => ({ editorInput: { type: 'binary' as const, uri: `file:///workspace/${file}.py` }, focus: false, preview: true })

const previewOptions = (file: string) => ({ ...options(file), editorInput: { type: 'editor' as const, uri: `file:///workspace/${file}.py` } })

test('preview replacement waits for its icon before publishing the new title', async () => {
  using _renderer = RendererWorker.registerMockRpc({})
  const requested = Promise.withResolvers<void>()
  const icons = Promise.withResolvers<readonly string[]>()
  using _iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      requested.resolve()
      return icons.promise
    },
  })
  const { context, published } = createContext()
  await context.updateState((state) => ({ ...state, fileIconCache: { 'file:///workspace/a.py': 'python.svg' } }))
  await openInputWithContext(context, options('a'))
  published.length = 0
  const opening = openInputWithContext(context, options('b'))
  await requested.promise
  expect(published.every((state) => state.layout.groups[0].tabs[0].title === 'a.py')).toBe(true)
  expect(context.getState().layout.groups[0].tabs[0].title).toBe('a.py')
  icons.resolve(['python.svg'])
  await opening
  const replacementStates = published.filter((state) => state.layout.groups[0].tabs[0].title === 'b.py')
  expect(replacementStates.length).toBeGreaterThan(0)
  for (const state of replacementStates) {
    expect(state.layout.groups[0].tabs).toHaveLength(1)
    expect(state.layout.groups[0].tabs[0]).toMatchObject({ icon: 'python.svg', title: 'b.py' })
  }
  expect(_iconRpc.invocations).toHaveLength(1)
})

test('cached icons are present in the first published state without another request', async () => {
  using _renderer = RendererWorker.registerMockRpc({})
  using _iconRpc = IconThemeWorker.registerMockRpc({})
  const { context, published } = createContext()
  await context.updateState((state) => ({ ...state, fileIconCache: { 'file:///workspace/a.py': 'python.svg' } }))
  published.length = 0
  await openInputWithContext(context, options('a'))
  expect(published.find((state) => state.layout.groups.length > 0)?.layout.groups[0].tabs[0].icon).toBe('python.svg')
  expect(_iconRpc.invocations).toEqual([])
})

test('failed icon resolution still opens a usable tab with a stable icon slot', async () => {
  using _renderer = RendererWorker.registerMockRpc({})
  using _iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      throw new Error('theme unavailable')
    },
  })
  const { context } = createContext()
  await openInputWithContext(context, options('a'))
  const tab = context.getState().layout.groups[0].tabs[0]
  expect(tab).toMatchObject({ loadingState: 'binary', title: 'a.py' })
  expect(renderTab(tab, true, 0, 0)[1]).toMatchObject({ childCount: 0, className: 'TabIcon' })
})

test('a theme change during icon resolution discards the old theme result', async () => {
  using _renderer = RendererWorker.registerMockRpc({})
  const requested = Promise.withResolvers<void>()
  const icons = Promise.withResolvers<readonly string[]>()
  let calls = 0
  using _iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      calls++
      if (calls === 1) {
        requested.resolve()
        return icons.promise
      }
      return ['new-theme.svg']
    },
  })
  const { context } = createContext()
  const opening = openInputWithContext(context, options('a'))
  await requested.promise
  await context.updateState((state) => ({ ...state, fileIconCache: {}, iconThemeVersion: 1 }))
  icons.resolve(['old-theme.svg'])
  await opening
  expect(context.getState().layout.groups[0].tabs[0].icon).toBe('new-theme.svg')
})

test('concurrent opens preserve both tabs and resolve icons against the current state', async () => {
  using _renderer = RendererWorker.registerMockRpc({})
  const requested = Promise.withResolvers<void>()
  const icons = Promise.withResolvers<readonly string[]>()
  let calls = 0
  using _iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      calls++
      if (calls === 1) {
        requested.resolve()
        return icons.promise
      }
      return ['python.svg']
    },
  })
  const { context } = createContext()
  const opening = openInputWithContext(context, { ...options('a'), preview: false })
  await requested.promise
  await openInputWithContext(context, { ...options('b'), preview: false })
  icons.resolve(['python.svg'])
  await opening
  expect(context.getState().layout.groups[0].tabs.map((tab) => tab.title)).toEqual(['b.py', 'a.py'])
})

test('a delayed preview open cannot replace a newer preview selection', async () => {
  using _renderer = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'Editor',
  })
  const requested = Promise.withResolvers<void>()
  const icons = Promise.withResolvers<readonly string[]>()
  let calls = 0
  using _iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      calls++
      if (calls === 1) {
        requested.resolve()
        return icons.promise
      }
      return ['python.svg']
    },
  })
  const { context } = createContext()

  const opening = openInputWithContext(context, previewOptions('a'))
  await requested.promise
  await openInputWithContext(context, previewOptions('b'))
  icons.resolve(['python.svg'])
  await opening
  expect(context.getState().layout.groups[0].tabs.map((tab) => tab.title)).toEqual(['b.py'])
})

test('closing the previous preview while its replacement waits does not reopen a tab', async () => {
  using _renderer = RendererWorker.registerMockRpc({})
  const requested = Promise.withResolvers<void>()
  const icons = Promise.withResolvers<readonly string[]>()
  using _iconRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getIcons': async () => {
      requested.resolve()
      return icons.promise
    },
  })
  const { context } = createContext()
  await context.updateState((state) => ({ ...state, fileIconCache: { 'file:///workspace/a.py': 'python.svg' } }))
  await openInputWithContext(context, options('a'))
  const opening = openInputWithContext(context, options('b'))
  await requested.promise
  const group = context.getState().layout.groups[0]
  await context.updateState((state) => closeTab(state, group.id, group.activeTabId))
  icons.resolve(['python.svg'])
  await opening
  expect(context.getState().layout.groups).toEqual([])
})
