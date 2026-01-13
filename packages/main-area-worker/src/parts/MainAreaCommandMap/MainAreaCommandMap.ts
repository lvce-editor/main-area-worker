import { terminate } from '@lvce-editor/viewlet-registry'
import type { MainAreaState, SplitDirection } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as CloseEditorGroup from '../CloseEditorGroup/CloseEditorGroup.ts'
import * as CloseTab from '../CloseTab/CloseTab.ts'
import * as FocusEditorGroup from '../FocusEditorGroup/FocusEditorGroup.ts'
import { getMainAreaVirtualDom } from '../GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'
import * as HandleMainAreaClick from '../HandleMainAreaClick/HandleMainAreaClick.ts'
import * as HandleMainAreaKeyboard from '../HandleMainAreaKeyboard/HandleMainAreaKeyboard.ts'
import * as HandleTabDragDrop from '../HandleTabDragDrop/HandleTabDragDrop.ts'
import { getCommandIds, wrapCommand } from '../MainAreaStates/MainAreaStates.ts'
import * as MoveTabToGroup from '../MoveTabToGroup/MoveTabToGroup.ts'
import * as OpenTab from '../OpenTab/OpenTab.ts'
import * as RestoreMainAreaState from '../RestoreMainAreaState/RestoreMainAreaState.ts'
import * as SaveMainAreaState from '../SaveMainAreaState/SaveMainAreaState.ts'
import * as SplitEditorGroup from '../SplitEditorGroup/SplitEditorGroup.ts'
import * as SwitchTab from '../SwitchTab/SwitchTab.ts'

export const mainAreaCommandMap: Record<string, (...args: any[]) => any> = {
  'MainArea.closeEditorGroup': wrapCommand(
    (state: MainAreaState, groupId: string): MainAreaState => CloseEditorGroup.closeEditorGroup(state, groupId),
  ),
  'MainArea.closeTab': wrapCommand((state: MainAreaState, groupId: string, tabId: string): MainAreaState => CloseTab.closeTab(state, groupId, tabId)),
  'MainArea.create': (): void => {},
  'MainArea.endTabDrag': wrapCommand(
    (state: MainAreaState, dragState: HandleTabDragDrop.DragState): MainAreaState => HandleTabDragDrop.endTabDrag(state, dragState),
  ),
  'MainArea.focusEditorGroup': wrapCommand(
    (state: MainAreaState, groupId: string): MainAreaState => FocusEditorGroup.focusEditorGroup(state, groupId),
  ),
  'MainArea.getCommandIds': getCommandIds,
  'MainArea.getVirtualDom': (state: MainAreaState): readonly any[] => getMainAreaVirtualDom(state),
  'MainArea.handleClick': wrapCommand((state: MainAreaState, event: any): MainAreaState => HandleMainAreaClick.handleMainAreaClick(state, event)),
  'MainArea.handleKeyboard': wrapCommand(
    (state: MainAreaState, event: any): MainAreaState => HandleMainAreaKeyboard.handleMainAreaKeyboard(state, event),
  ),
  'MainArea.moveTabToGroup': wrapCommand(
    (state: MainAreaState, sourceGroupId: string, targetGroupId: string, tabId: string, targetIndex?: number): MainAreaState =>
      MoveTabToGroup.moveTabToGroup(state, sourceGroupId, targetGroupId, tabId, targetIndex),
  ),
  'MainArea.openTab': wrapCommand(
    (state: MainAreaState, groupId: string, tab: Omit<Tab, 'id'>): MainAreaState => OpenTab.openTab(state, groupId, tab),
  ),
  'MainArea.restoreState': wrapCommand(
    (state: MainAreaState, savedState: string): MainAreaState => RestoreMainAreaState.restoreMainAreaState(savedState, state),
  ),
  'MainArea.saveState': (state: MainAreaState): string => SaveMainAreaState.saveMainAreaState(state),
  'MainArea.splitEditorGroup': wrapCommand(
    (state: MainAreaState, groupId: string, direction: SplitDirection): MainAreaState => SplitEditorGroup.splitEditorGroup(state, groupId, direction),
  ),
  'MainArea.startTabDrag': (state: MainAreaState, tabId: string, groupId: string): { state: MainAreaState; dragState: HandleTabDragDrop.DragState } =>
    HandleTabDragDrop.startTabDrag(state, tabId, groupId),
  'MainArea.switchTab': wrapCommand(
    (state: MainAreaState, groupId: string, tabId: string): MainAreaState => SwitchTab.switchTab(state, groupId, tabId),
  ),
  'MainArea.terminate': terminate,
  'MainArea.updateTabDrag': (
    state: MainAreaState,
    dragState: HandleTabDragDrop.DragState,
    targetGroupId: string,
    targetIndex: number,
  ): HandleTabDragDrop.DragState => HandleTabDragDrop.updateTabDrag(state, dragState, targetGroupId, targetIndex),
}
