import { expect, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'

test('show should throw error indicating it is deprecated', async () => {
  await expect(ContextMenu.show(0, 0, MenuEntryId.Main)).rejects.toThrow('ContextMenu.show is deprecated. Use ContextMenu.show2 instead')
})

test('show should throw error with different coordinates', async () => {
  await expect(ContextMenu.show(100, 200, MenuEntryId.Main)).rejects.toThrow('ContextMenu.show is deprecated. Use ContextMenu.show2 instead')
})

test('show should throw error with different menu entry id', async () => {
  await expect(ContextMenu.show(50, 50, MenuEntryId.Tab)).rejects.toThrow('ContextMenu.show is deprecated. Use ContextMenu.show2 instead')
})

test('show should throw error with additional args', async () => {
  await expect(ContextMenu.show(10, 20, MenuEntryId.Main, 'arg1', 'arg2')).rejects.toThrow(
    'ContextMenu.show is deprecated. Use ContextMenu.show2 instead',
  )
})

test('show should throw error with negative coordinates', async () => {
  await expect(ContextMenu.show(-10, -20, MenuEntryId.Main)).rejects.toThrow('ContextMenu.show is deprecated. Use ContextMenu.show2 instead')
})
