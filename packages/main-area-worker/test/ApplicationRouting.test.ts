import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { createViewlet } from '../src/parts/CreateViewlet/CreateViewlet.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { notifyActiveEditorChange } from '../src/parts/NotifyActiveEditorChange/NotifyActiveEditorChange.ts'
import { notifyMountedViewlets } from '../src/parts/NotifyMountedViewlets/NotifyMountedViewlets.ts'
import { openInput } from '../src/parts/OpenInput/OpenInput.ts'
import { save } from '../src/parts/Save/Save.ts'

afterEach(() => {
  MainAreaStates.clear()
})

test('create retains the owning application without changing legacy state shape', () => {
  create(1, 'memfs:///source', 0, 0, 600, 800, 1, '/assets', 35, 'source')
  create(2, 'memfs:///preview', 0, 0, 600, 800, 1, '/assets', 35, 'preview')
  create(3, '', 0, 0, 600, 800, 1, '/assets')
  expect(MainAreaStates.get(1).newState.applicationId).toBe('source')
  expect(MainAreaStates.get(2).newState.applicationId).toBe('preview')
  expect(MainAreaStates.get(3).newState).not.toHaveProperty('applicationId')
})

test('concurrent file openings keep their application through asynchronous module selection', async () => {
  const entered = Promise.withResolvers<void>()
  const gate = Promise.withResolvers<void>()
  using rpc = RendererWorker.registerMockRpc({
    async 'Application.execute'(applicationId: string, command: string) {
      if (command === 'Layout.getModuleId') {
        if (applicationId === 'source') {
          entered.resolve()
          await gate.promise
        }
        return 'Editor'
      }
      return undefined
    },
  })
  const source = { ...createDefaultState(), applicationId: 'source', uid: 1 }
  const preview = { ...createDefaultState(), applicationId: 'preview', uid: 2 }
  const options = { editorInput: { type: 'editor' as const, uri: 'memfs:///main.ts' }, focus: false }
  const openingSource = openInput(source, options)
  await entered.promise
  const openedPreview = await openInput(preview, options)
  gate.resolve()
  const openedSource = await openingSource
  const sourceTab = openedSource.layout.groups[0].tabs[0]
  const previewTab = openedPreview.layout.groups[0].tabs[0]
  expect(sourceTab.editorUid).not.toBe(previewTab.editorUid)
  const creations = rpc.invocations.filter(([method, , command]) => method === 'Application.execute' && command === 'Layout.createViewlet')
  expect(creations.map((call) => [call[1], call[4]])).toEqual([
    ['preview', previewTab.editorUid],
    ['source', sourceTab.editorUid],
  ])
  expect(rpc.invocations.some(([method]) => method === 'Layout.createViewlet')).toBe(false)
  await notifyActiveEditorChange(source, openedSource)
  await notifyMountedViewlets(source, openedSource)
  expect(rpc.invocations).toContainEqual(['Application.execute', 'source', 'Layout.handleActiveEditorChange', 'memfs:///main.ts'])
  expect(rpc.invocations).toContainEqual(['Application.execute', 'source', 'Layout.setMountedViewlets', 1, [sourceTab.editorUid]])
})

test('viewlet creation carries extension arguments and application ownership separately', async () => {
  using rpc = RendererWorker.registerMockRpc({ 'Application.execute': async () => {} })
  const bounds = { height: 600, width: 400, x: 0, y: 0 }
  await createViewlet('ExtensionView', 100, 200, bounds, 'memfs:///extension.json', [{ viewId: 'test' }], 'preview')
  expect(rpc.invocations[0]).toEqual([
    'Application.execute',
    'preview',
    'Layout.createViewlet',
    'ExtensionView',
    100,
    200,
    bounds,
    'memfs:///extension.json',
    [{ viewId: 'test' }],
  ])
})

test('saving an application editor scopes dirty-state notifications to its own main area', async () => {
  using rpc = RendererWorker.registerMockRpc({
    async 'Application.execute'(_applicationId: string, command: string) {
      return command === 'Layout.getModuleId' ? 'Editor' : undefined
    },
    'Editor.save': async () => ({ modified: false }),
  })
  const state = { ...createDefaultState(), applicationId: 'source', uid: 10 }
  const opened = await openInput(state, { editorInput: { type: 'editor', uri: 'memfs:///main.ts' }, focus: false })
  const dirty = {
    ...opened,
    layout: {
      ...opened.layout,
      groups: opened.layout.groups.map((group) => ({ ...group, tabs: group.tabs.map((tab) => ({ ...tab, isDirty: true })) })),
    },
  }
  MainAreaStates.set(10, opened, dirty)
  const saved = await save(dirty)
  expect(saved.layout.groups[0].tabs[0].isDirty).toBe(false)
  expect(rpc.invocations).toContainEqual(['Application.execute', 'source', 'Main.handleModifiedStatusChange', 'memfs:///main.ts', false])
  expect(rpc.invocations.some(([method]) => method === 'Main.handleModifiedStatusChange')).toBe(false)
})
