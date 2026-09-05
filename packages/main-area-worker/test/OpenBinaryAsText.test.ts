import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickAction } from '../src/parts/HandleClickAction/HandleClickAction.ts'
import { openBinaryAsText } from '../src/parts/OpenBinaryAsText/OpenBinaryAsText.ts'
import { openInput } from '../src/parts/OpenInput/OpenInput.ts'

test('openBinaryAsText reopens the binary tab in the text editor', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.createViewlet': async () => {},
  })
  const binaryState = await openInput(createDefaultState(), {
    editorInput: {
      type: 'binary',
      uri: 'file:///path/archive.zip',
    },
    focus: false,
    preview: false,
  })

  const result = await handleClickAction(binaryState, 'open-in-text-editor')
  const tab = result.layout.groups[0].tabs[0]

  expect(result.layout.groups[0].tabs).toHaveLength(1)
  expect(tab.editorInput).toEqual({
    forceText: true,
    type: 'editor',
    uri: 'file:///path/archive.zip',
  })
  expect(tab).not.toHaveProperty('editorType')
  expect(tab.loadingState).toBe('loaded')
  expect(mockRpc.invocations).toContainEqual([
    'Layout.createViewlet',
    'Editor',
    tab.editorUid,
    tab.id,
    { height: -35, width: 0, x: 0, y: 35 },
    'file:///path/archive.zip',
  ])
})

test('openBinaryAsText returns state unchanged without an active binary tab', async () => {
  const state = createDefaultState()
  await expect(openBinaryAsText(state)).resolves.toBe(state)
})
