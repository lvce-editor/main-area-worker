import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { flushDeferredDisposals } from '../DisposeEditors/DisposeEditors.ts'
import { registry } from '../MainAreaRegistry/MainAreaRegistry.ts'
import { notifyMountedViewlets } from '../NotifyMountedViewlets/NotifyMountedViewlets.ts'

const timers = new Map<object, { uid: number; timer: ReturnType<typeof setTimeout> }>()

export const cancelPaintHolds = (uid: number): void => {
  for (const [token, entry] of timers) {
    if (entry.uid !== uid) {
      continue
    }

    clearTimeout(entry.timer)
    timers.delete(token)
  }
}

const expire = async (uid: number, groupId: number, token: object): Promise<void> => {
  timers.delete(token)
  const instance = registry.get(uid)
  if (!instance || instance.newState.layout.groups.every((group) => !(group.id === groupId && group.paintHold?.token === token))) return
  const state = instance.newState
  const groups = state.layout.groups.map((group) => (group.id === groupId ? { ...group, paintHold: undefined } : group))
  const next = { ...state, layout: { ...state.layout, groups } }
  registry.set(uid, instance.oldState, next)
  await notifyMountedViewlets(state, next)
  await ApplicationRpc.invoke(state.applicationId, 'Layout.renderMainAreaPending', uid)
  await flushDeferredDisposals()
}

// Presentation is separate from selection: a loading tab never makes the outgoing
// editor the active editor, even though its reference remains visible briefly.
export const updatePresentation = (oldState: MainAreaState, state: MainAreaState): MainAreaState => {
  let changed = false
  const groups = state.layout.groups.map((group) => {
    const previous = oldState.layout.groups.find((item) => item.id === group.id)
    const active = group.tabs.find((tab) => tab.id === group.activeTabId)
    let paintHold = group.paintHold && timers.has(group.paintHold.token) ? group.paintHold : undefined
    if (active?.loadingState !== 'loading') {
      paintHold = undefined
    } else if (!paintHold && previous && previous.activeTabId !== group.activeTabId) {
      const outgoing = previous.paintHold?.tab ?? previous.tabs.find((tab) => tab.id === previous.activeTabId)
      if (previous.paintHold && timers.has(previous.paintHold.token)) {
        ;({ paintHold } = previous)
      } else if (outgoing?.loadingState === 'loaded' && outgoing.editorUid >= 0) {
        paintHold = { tab: outgoing, token: {} }
        const { token } = paintHold
        const timer = setTimeout(() => {
          void expire(state.uid, group.id, token).catch((error) => console.warn('Failed to expire editor paint hold', error))
        }, 100)
        timers.set(token, { timer, uid: state.uid })
      }
    }
    if (paintHold === group.paintHold) return group
    changed = true
    return { ...group, paintHold }
  })
  const tokens = new Set(groups.flatMap((group) => (group.paintHold ? [group.paintHold.token] : [])))
  for (const [token, entry] of timers) {
    if (entry.uid !== state.uid || tokens.has(token)) {
      continue
    }

    clearTimeout(entry.timer)
    timers.delete(token)
  }
  return changed ? { ...state, layout: { ...state.layout, groups } } : state
}
