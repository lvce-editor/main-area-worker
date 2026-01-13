import { terminate } from '@lvce-editor/viewlet-registry'
import type { MainAreaState, SplitDirection } from '../MainAreaState/MainAreaState.ts'
import type { Tab } from '../MainAreaState/MainAreaState.ts'
import * as CloseEditorGroup from '../CloseEditorGroup/CloseEditorGroup.ts'
import * as CloseTab from '../CloseTab/CloseTab.ts'
import * as FocusEditorGroup from '../FocusEditorGroup/FocusEditorGroup.ts'
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
import { getMainAreaVirtualDom } from '../GetMainAreaVirtualDom/GetMainAreaVirtualDom.ts'

export const mainAreaCommandMap: Record<string, (...args: any[]) => any> = {
  'MainArea.create': (): void => {},
  'MainArea.openTab': wrapCommand((state: MainAreaState, groupId: string, tab: Omit<Tab, 'id'>): MainAreaState => OpenTab.openTab(state, groupId, tab)),
  'MainArea.closeTab': wrapCommand((state: MainAreaState, groupId: string, tabId: string): MainAreaState => CloseTab.closeTab(state, groupId, tabId)),
  'MainArea.switchTab': wrapCommand((state: MainAreaState, groupId: string, tabId: string): MainAreaState => SwitchTab.switchTab(state, groupId, tabId)),
  'MainArea.splitEditorGroup': wrapCommand((state: MainAreaState, groupId: string, direction: SplitDirection): MainAreaState => SplitEditorGroup.splitEditorGroup(state, groupId, direction)),
  'MainArea.closeEditorGroup': wrapCommand((state: MainAreaState, groupId: string): MainAreaState => CloseEditorGroup.closeEditorGroup(state, groupId)),
  'MainArea.focusEditorGroup': wrapCommand((state: MainAreaState, groupId: string): MainAreaState => FocusEditorGroup.focusEditorGroup(state, groupId)),
  'MainArea.moveTabToGroup': wrapCommand((state: MainAreaState, sourceGroupId: string, targetGroupId: string, tabId: string, targetIndex?: number): MainAreaState => MoveTabToGroup.moveTabToGroup(state, sourceGroupId, targetGroupId, tabId, targetIndex)),
  'MainArea.handleClick': wrapCommand((state: MainAreaState, event: any): MainAreaState => HandleMainAreaClick.handleMainAreaClick(state, event)),
  'MainArea.handleKeyboard': wrapCommand((state: MainAreaState, event: any): MainAreaState => HandleMainAreaKeyboard.handleMainAreaKeyboard(state, event)),
  'MainArea.startTabDrag': (state: MainAreaState, tabId: string, groupId: string): { state: MainAreaState; dragState: HandleTabDragDrop.DragState } => HandleTabDragDrop.startTabDrag(state, tabId, groupId),
  'MainArea.updateTabDrag': (state: MainAreaState, dragState: HandleTabDragDrop.DragState, targetGroupId: string, targetIndex: number): HandleTabDragDrop.DragState => HandleTabDragDrop.updateTabDrag(state, dragState, targetGroupId, targetIndex),
  'MainArea.endTabDrag': wrapCommand((state: MainAreaState, dragState: HandleTabDragDrop.DragState): MainAreaState => HandleTabDragDrop.endTabDrag(state, dragState)),
  'MainArea.getVirtualDom': (state: MainAreaState): readonly any[] => getMainAreaVirtualDom(state),
  'MainArea.saveState': (state: MainAreaState): string => SaveMainAreaState.saveMainAreaState(state),
  'MainArea.restoreState': wrapCommand((state: MainAreaState, savedState: string): MainAreaState => RestoreMainAreaState.restoreMainAreaState(savedState, state)),
  'MainArea.getCommandIds': getCommandIds,
  'MainArea.terminate': terminate,
}
