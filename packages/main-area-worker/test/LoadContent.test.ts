import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should load status bar items when preference is true', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return true
      }
      return undefined
    },
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        command: 'test.command',
        icon: 'test-icon',
        id: 'test.item',
        text: 'Test Item',
        tooltip: 'Test Tooltip',
      },
    ],
  })

  const state: any = { ...createDefaultState(), uid: 1 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    ['Preferences.get', 'statusBar.itemsVisible'],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result.uid).toBe(1)
})

test('loadContent should return empty array when preference is false', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return false
      }
      return undefined
    },
  })

  const state: any = { ...createDefaultState(), uid: 2 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([['Preferences.get', 'statusBar.itemsVisible']])

  expect(result.uid).toBe(2)
})

test('loadContent should return empty array when preference is undefined', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'Preferences.get': async () => undefined,
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  const state: any = { ...createDefaultState(), uid: 3 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    ['Preferences.get', 'statusBar.itemsVisible'],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result.uid).toBe(3)
})

test('loadContent should preserve existing state properties', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => false,
  })

  const state: any = {
    ...createDefaultState(),
    disposed: true,
    uid: 4,
  }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([['Preferences.get', 'statusBar.itemsVisible']])

  expect(result.uid).toBe(4)
  expect(result.disposed).toBe(true)
})

test('loadContent should handle multiple status bar items', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
    'Preferences.get': async () => true,
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        command: 'command1',
        icon: 'icon1',
        id: 'item1',
        text: 'Item 1',
        tooltip: 'Tooltip 1',
      },
      {
        command: 'command2',
        icon: 'icon2',
        id: 'item2',
        text: 'Item 2',
        tooltip: 'Tooltip 2',
      },
    ],
  })

  const state: any = { ...createDefaultState(), uid: 5 }
  const result = await LoadContent.loadContent(state)

  expect(result).toBeDefined()

  expect(mockRendererRpc.invocations).toEqual([
    ['Preferences.get', 'statusBar.itemsVisible'],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl, '', 0],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem, '', 0],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])
})
