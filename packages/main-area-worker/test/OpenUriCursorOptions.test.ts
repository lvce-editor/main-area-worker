import { afterEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as MainAreaStates from '../src/parts/MainAreaStates/MainAreaStates.ts'
import { openUri } from '../src/parts/OpenUri/OpenUri.ts'

afterEach(() => {
  const state = createDefaultState()
  MainAreaStates.set(state.uid, state, state)
})

test.each([true, false])('opens at the requested position with shouldFocus=%s', async (shouldFocus) => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
    'Viewlet.executeViewletCommand': async () => {},
    'Viewlet.focusSelector': async () => {},
  })
  const uri = 'file:///workspace/test.txt'
  const state = await openUri(createDefaultState(), {
    initialCursorPosition: { columnIndex: 7, rowIndex: 4 },
    shouldFocus,
    uri,
  })
  const tab = state.layout.groups[0].tabs[0]
  expect(tab.loadingState).toBe('loaded')
  const cursorCommand = ['Viewlet.executeViewletCommand', tab.editorUid, 'cursorSet', 4, 7]
  expect(rpc.invocations).toContainEqual(cursorCommand)
  const focusCommands = rpc.invocations.filter(([method]) => method === 'Viewlet.focusSelector')
  expect(focusCommands).toHaveLength(shouldFocus ? 1 : 0)
  const cursorIndex = rpc.invocations.findIndex(([method]) => method === 'Viewlet.executeViewletCommand')
  const focusIndex = rpc.invocations.findIndex(([method]) => method === 'Viewlet.focusSelector')
  expect(focusIndex > cursorIndex).toBe(shouldFocus)
  // Cursor navigation options stay in the main area, while focus reaches the viewlet load context.
  expect(rpc.invocations.find(([method]) => method === 'Layout.createViewlet')).toEqual([
    'Layout.createViewlet',
    'editor.text',
    expect.any(Number),
    expect.any(Number),
    expect.any(Object),
    uri,
    [{ deferLoadContentLater: true, focus: shouldFocus }],
  ])
})

test('moves the cursor in a reused tab without creating another editor', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
    'Viewlet.executeViewletCommand': async () => {},
    'Viewlet.focusSelector': async () => {},
  })
  const uri = 'file:///workspace/test.txt'
  const first = await openUri(createDefaultState(), { focus: false, uri })
  await openUri(first, { focus: false, uri: 'file:///workspace/other.txt' })
  const result = await openUri(first, {
    initialCursorPosition: { columnIndex: 0, rowIndex: 0 },
    shouldFocus: true,
    uri,
  })
  const tab = result.layout.groups[0].tabs.find((entry) => entry.uri === uri)!
  expect(result.layout.groups[0].tabs).toHaveLength(2)
  expect(result.layout.groups[0].activeTabId).toBe(tab.id)
  expect(rpc.invocations.filter(([method]) => method === 'Layout.createViewlet')).toHaveLength(2)
  expect(rpc.invocations).toContainEqual(['Viewlet.executeViewletCommand', tab.editorUid, 'cursorSet', 0, 0])
})

test('defaults object options to focus and lets shouldFocus override legacy focus', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
    'Viewlet.focusSelector': async () => {},
  })
  const first = await openUri(createDefaultState(), { uri: 'file:///workspace/first.txt' })
  expect(rpc.invocations.filter(([method]) => method === 'Viewlet.focusSelector')).toHaveLength(1)
  await openUri(first, { focus: true, shouldFocus: false, uri: 'file:///workspace/second.txt' })
  expect(rpc.invocations.filter(([method]) => method === 'Viewlet.focusSelector')).toHaveLength(1)
})

test.each(['file:///workspace/image.png', 'file:///workspace/data.zip'])('does not position a non-text editor: %s', async (uri) => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'image',
  })
  await openUri(createDefaultState(), {
    initialCursorPosition: { columnIndex: 0, rowIndex: 1 },
    shouldFocus: false,
    uri,
  })
  expect(rpc.invocations.some(([method]) => method === 'Viewlet.executeViewletCommand')).toBe(false)
})

test('does not position an editor when opening fails', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {
      throw new Error('load failed')
    },
    'Layout.getModuleId': async () => 'editor.text',
  })
  const state = await openUri(createDefaultState(), {
    initialCursorPosition: { columnIndex: 0, rowIndex: 1 },
    shouldFocus: false,
    uri: 'file:///workspace/test.txt',
  })
  expect(state.layout.groups[0].tabs[0].loadingState).toBe('error')
  expect(rpc.invocations.some(([method]) => method === 'Viewlet.executeViewletCommand')).toBe(false)
})

test('highlights problems in the exact new or reused tab without focusing it', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
    'Viewlet.executeViewletCommand': async () => {},
    'Viewlet.focusSelector': async () => {},
  })
  const uri = 'file:///workspace/problem.txt'
  const options = {
    initialCursorPosition: { columnIndex: 2, highlightProblem: true, rowIndex: 4 },
    shouldFocus: false,
    uri,
  }
  const first = await openUri(createDefaultState(), options)
  const tab = first.layout.groups[0].tabs[0]
  const other = await openUri(first, { shouldFocus: false, uri: 'file:///workspace/other.txt' })
  const result = await openUri(other, options)
  expect(result.layout.groups[0].activeTabId).toBe(tab.id)
  expect(rpc.invocations.filter(([method]) => method === 'Viewlet.executeViewletCommand')).toEqual([
    ['Viewlet.executeViewletCommand', tab.editorUid, 'revealProblem', 4, 2],
    ['Viewlet.executeViewletCommand', tab.editorUid, 'handleBlur'],
    ['Viewlet.executeViewletCommand', tab.editorUid, 'revealProblem', 4, 2],
  ])
  expect(rpc.invocations.some(([method]) => method === 'Viewlet.focusSelector')).toBe(false)
})

test.each([true, false])('applies a definition range to an existing tab, active=%s', async (active) => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
    'Viewlet.executeViewletCommand': async () => {},
    'Viewlet.focusSelector': async () => {},
  })
  const uri = 'file:///workspace/definition.ts'
  let state = await openUri(createDefaultState(), { focus: false, uri })
  const editorUid = state.layout.groups[0].tabs[0].editorUid
  if (!active) {
    state = await openUri(state, { focus: false, uri: 'file:///workspace/source.ts' })
  }
  const result = await openUri(state, uri, false, {
    startRowIndex: 0,
    startColumnIndex: 13,
    endRowIndex: 0,
    endColumnIndex: 16,
  })
  expect(rpc.invocations).toContainEqual(['Viewlet.executeViewletCommand', editorUid, 'setSelections', new Uint32Array([0, 13, 0, 16])])
  expect(result.layout.groups[0].tabs).toHaveLength(active ? 1 : 2)
})

test.each([
  undefined,
  'unrelated context',
  {},
  { startRowIndex: 1 },
  { startRowIndex: 1, startColumnIndex: 2 },
  { startRowIndex: 1, startColumnIndex: 2, endRowIndex: 1 },
])('preserves a reused selection without a complete destination: %j', async (destination) => {
  using rpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
    'Layout.getModuleId': async () => 'editor.text',
    'Viewlet.executeViewletCommand': async () => {},
    'Viewlet.focusSelector': async () => {},
  })
  const uri = 'file:///workspace/definition.ts'
  const state = await openUri(createDefaultState(), { focus: false, uri })
  await openUri(state, uri, false, destination)
  expect(rpc.invocations.some(([method]) => method === 'Viewlet.executeViewletCommand')).toBe(false)
})
