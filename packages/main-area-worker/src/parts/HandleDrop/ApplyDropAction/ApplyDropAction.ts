import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { DropAction } from '../DropAction/DropAction.ts'
import * as EditorSplitDirection from '../../EditorSplitDirection/EditorSplitDirection.ts'
import { focusEditorGroup } from '../../FocusEditorGroup/FocusEditorGroup.ts'
import { openUrisWithContext } from '../../OpenUris/OpenUris.ts'
import { splitForDrop } from '../SplitForDrop/SplitForDrop.ts'

export const applyDropAction = async (
  context: AsyncCommandContext<MainAreaState>,
  action: DropAction,
  splitDirection: number,
  targetGroupId?: number,
): Promise<void> => {
  switch (action.command) {
    case 'openFiles': {
      if (action.uris.length > 0 && splitDirection !== EditorSplitDirection.None) {
        await context.updateState((state) => splitForDrop(state, splitDirection, targetGroupId))
      } else if (action.uris.length > 0 && targetGroupId !== undefined) {
        await context.updateState((state) => focusEditorGroup(state, targetGroupId))
      }
      await openUrisWithContext(context, action.uris, splitDirection === EditorSplitDirection.None)
      break
    }
    case 'setPath':
      void RendererWorker.invoke('Workspace.setPath', action.value).catch(() => {})
      break
    case 'setUri':
      void RendererWorker.invoke('Workspace.setUri', action.value).catch(() => {})
      break
  }
}
