import type { MainAreaState } from '../../MainAreaState/MainAreaState.ts'
import type { ViewletLifecycleResult } from '../ViewletLifecycleResult.ts'

/**
 * Called when switching tabs.
 * With reference nodes, attachment/detachment is handled automatically by virtual DOM rendering.
 * No attach/detach commands needed - virtual DOM will render the correct reference at each position.
 */
export const switchViewlet = (state: MainAreaState, fromTabId: number | undefined, toTabId: number): ViewletLifecycleResult => {
  // No commands needed - virtual DOM reference nodes handle attachment automatically
  // Virtual DOM will:
  // 1. Remove the old reference node from the previous active tab
  // 2. Add the new reference node for the now-active tab
  // This achieves the same effect as detach/attach without explicit commands

  return { commands: [], newState: state }
}
