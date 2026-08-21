import { expect, jest, test } from '@jest/globals'
import { MenuEntryId } from '@lvce-editor/constants'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry } from '@lvce-editor/rpc-registry'
import * as ContextMenu from '../src/parts/ContextMenu/ContextMenu.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('forwards context menus through a connected renderer process', async () => {
  const forwardRendererWorkerCommand = jest.fn(async (..._args: readonly unknown[]) => {})
  RendererProcess.set(
    Object.assign(
      createMockRpc({
        commandMap: {
          'Viewlet.forwardRendererWorkerCommand': forwardRendererWorkerCommand,
        },
      }),
      { dispose: jest.fn() },
    ),
  )

  await ContextMenu.show2(7, MenuEntryId.Main, 20, 30, { groupId: -1, menuId: MenuEntryId.Main })

  expect(forwardRendererWorkerCommand).toHaveBeenCalledWith('ContextMenu.show2', 7, MenuEntryId.Main, 20, 30, {
    groupId: -1,
    menuId: MenuEntryId.Main,
  })
  await RendererProcessRegistry.dispose()
})
