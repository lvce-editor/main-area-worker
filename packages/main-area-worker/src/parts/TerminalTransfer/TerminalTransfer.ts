import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { closeTab } from '../CloseTab/CloseTab.ts'
import { ensureActiveGroup } from '../EnsureActiveGroup/EnsureActiveGroup.ts'
import { findTabById } from '../FindTabById/FindTabById.ts'
import { focus } from '../Focus/Focus.ts'
import { focusEditorGroup } from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getActiveTabId } from '../GetActiveTabId/GetActiveTabId.ts'
import { getSelectedTabBounds } from '../SelectTab/GetSelectedTabBounds/GetSelectedTabBounds.ts'
import { updateTab } from '../UpdateTab/UpdateTab.ts'

export interface TerminalDrag {
  readonly sourceUid: number
  readonly terminalUid: number
}

export const parseTerminalDrag = (strings: readonly string[]): TerminalDrag | undefined => {
  const value = strings.find((item) => item.startsWith('lvce-terminal:'))
  if (!value) {
    return undefined
  }
  try {
    const data = JSON.parse(value.slice('lvce-terminal:'.length))
    if (Number.isSafeInteger(data.sourceUid) && data.sourceUid > 0 && Number.isSafeInteger(data.terminalUid) && data.terminalUid > 0) {
      return data
    }
  } catch {
    // Foreign or malformed drag data is not a terminal transfer.
  }
  return undefined
}

export const receiveTerminal = async (context: AsyncCommandContext<MainAreaState>, drag: TerminalDrag, targetGroupId?: number): Promise<void> => {
  const initial = context.getState()
  const descriptor = await RendererWorker.invoke('TerminalTransfer.takePanelTerminal', initial.uid, drag.sourceUid, drag.terminalUid)
  if (!descriptor) {
    return
  }
  let tabId = -1
  try {
    let state = context.getState()
    if (targetGroupId !== undefined) {
      state = focusEditorGroup(state, targetGroupId)
    }
    // Pin an existing preview so adoption never replaces and leaks its viewlet.
    const activeId = getActiveTabId(state)
    if (activeId !== undefined) {
      state = updateTab(state, activeId, { isPreview: false })
    }
    state = ensureActiveGroup(state, `terminal://${drag.terminalUid}`, false, descriptor.label)
    tabId = getActiveTabId(state)!
    state = updateTab(state, tabId, {
      editorUid: drag.terminalUid,
      icon: descriptor.icon,
      loadingState: 'loaded',
      terminal: true,
    })
    const location = findTabById(state, tabId)!
    const bounds = getSelectedTabBounds(state, location.groupId)
    await RendererWorker.invoke('TerminalTransfer.resize', drag.terminalUid, bounds)
    await context.updateState(() => state)
    await ApplicationRpc.invoke(state.applicationId, 'Layout.renderMainAreaPending', state.uid)
    await focus(state)
    await RendererWorker.invoke('TerminalTransfer.commit', drag.terminalUid, initial.uid)
  } catch (error) {
    if (tabId !== -1) {
      await context.updateState((state) => {
        const location = findTabById(state, tabId)
        return location ? closeTab(state, location.groupId, tabId) : state
      })
    }
    try {
      await ApplicationRpc.invoke(initial.applicationId, 'Layout.renderMainAreaPending', initial.uid)
    } finally {
      await RendererWorker.invoke('TerminalTransfer.rollback', drag.terminalUid)
    }
    throw error
  }
}

export const releaseTerminal = async (context: AsyncCommandContext<MainAreaState>, terminalUid: number, panelUid: number): Promise<void> => {
  const state = context.getState()
  const group = state.layout.groups.find((item) => item.tabs.some((tab) => tab.terminal && tab.editorUid === terminalUid))
  const tab = group?.tabs.find((item) => item.terminal && item.editorUid === terminalUid)
  if (!group || !tab) {
    return
  }
  const accepted = await RendererWorker.invoke('TerminalTransfer.beginPanelTransfer', state.uid, panelUid, terminalUid)
  if (!accepted) {
    return
  }
  try {
    await context.updateState((latest) => closeTab(latest, group.id, tab.id))
    // Remove the old reference before reparenting the live DOM node.
    await ApplicationRpc.invoke(state.applicationId, 'Layout.renderMainAreaPending', state.uid)
    await RendererWorker.invoke('TerminalTransfer.attachPanelTerminal', state.uid, panelUid, terminalUid, tab.title, tab.icon)
  } catch (error) {
    const live = await RendererWorker.invoke('TerminalTransfer.cancelPanelTransfer', terminalUid)
    if (live) {
      await context.updateState((latest) => ({ ...latest, layout: state.layout }))
      await ApplicationRpc.invoke(state.applicationId, 'Layout.renderMainAreaPending', state.uid)
    }
    throw error
  }
}

export const handleTerminalExit = (state: MainAreaState, terminalUid: number): MainAreaState => {
  const group = state.layout.groups.find((item) => item.tabs.some((tab) => tab.terminal && tab.editorUid === terminalUid))
  const tab = group?.tabs.find((item) => item.terminal && item.editorUid === terminalUid)
  return group && tab ? closeTab(state, group.id, tab.id) : state
}

export const handlePanelDrop = async (context: AsyncCommandContext<MainAreaState>, panelUid: number, dropId: number): Promise<void> => {
  const { strings } = await DragAndDropWorker.getDroppedItemsByDropId(dropId, false)
  const drag = parseTerminalDrag(strings)
  if (drag?.sourceUid !== context.getState().uid) {
    return
  }
  await releaseTerminal(context, drag.terminalUid, panelUid)
}
