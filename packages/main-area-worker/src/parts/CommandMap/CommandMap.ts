import { terminate } from '@lvce-editor/viewlet-registry'
import { closeActiveEditor } from '../CloseActiveEditor/CloseActiveEditor.ts'
import { closeAll } from '../CloseAll/CloseAll.ts'
import { closeEditorGroup } from '../CloseEditorGroup/CloseEditorGroup.ts'
import { closeFocusedTab } from '../CloseFocusedTab/CloseFocusedTab.ts'
import { closeOtherTabs } from '../CloseOtherTabs/CloseOtherTabs.ts'
import { closeSaved } from '../CloseSaved/CloseSaved.ts'
import { closeTabsByUris } from '../CloseTabsByUris/CloseTabsByUris.ts'
import { closeTabsRight } from '../CloseTabsRight/CloseTabsRight.ts'
import { copyIntoNewWindow } from '../CopyIntoNewWindow/CopyIntoNewWindow.ts'
import { copyPath } from '../CopyPath/CopyPath.ts'
import { copyRelativePath } from '../CopyRelativePath/CopyRelativePath.ts'
import * as MainArea from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { focusNextTab } from '../FocusNextTab/FocusNextTab.ts'
import { focusPreviousTab } from '../FocusPreviousTab/FocusPreviousTab.ts'
import { getMenuIds } from '../GetMenuIds/GetMenuIds.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { handleClickAction } from '../HandleClickAction/HandleClickAction.ts'
import { handleClickCloseTab } from '../HandleClickCloseTab/HandleClickCloseTab.ts'
import { handleClickTab } from '../HandleClickTab/HandleClickTab.ts'
import { handleClickTogglePreview } from '../HandleClickTogglePreview/HandleClickTogglePreview.ts'
import { handleContextMenu } from '../HandleContextMenu/HandleContextMenu.ts'
import { handleDoubleClick } from '../HandleDoubleClick/HandleDoubleClick.ts'
import { handleHeaderDoubleClick } from '../HandleHeaderDoubleClick/HandleHeaderDoubleClick.ts'
import { handleIconThemeChange } from '../HandleIconThemeChange/HandleIconThemeChange.ts'
import { handleModifiedStatusChangeWithContext } from '../HandleModifiedStatusChange/HandleModifiedStatusChange.ts'
import { handleResize } from '../HandleResize/HandleResize.ts'
import { handleSashPointerDown } from '../HandleSashPointerDown/HandleSashPointerDown.ts'
import { handleSashPointerMove } from '../HandleSashPointerMove/HandleSashPointerMove.ts'
import { handleSashPointerUp } from '../HandleSashPointerUp/HandleSashPointerUp.ts'
import { handleTabContextMenu } from '../HandleTabContextMenu/HandleTabContextMenu.ts'
import { handleUriChange } from '../HandleUriChange/HandleUriChange.ts'
import { handleWorkspaceChange } from '../HandleWorkspaceChange/HandleWorkspaceChange.ts'
import { handleWorkspaceRefreshWithContext } from '../HandleWorkspaceRefresh/HandleWorkspaceRefresh.ts'
import { hasActiveTextEditor } from '../HasActiveTextEditor/HasActiveTextEditor.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getCommandIds, wrapAsyncCommand, wrapGetter, wrapSerialAsyncCommand, wrapSerialCommand } from '../MainAreaStates/MainAreaStates.ts'
import { getMenuEntries } from '../MenuEntries/MenuEntries.ts'
import { moveIntoNewWindow } from '../MoveIntoNewWindow/MoveIntoNewWindow.ts'
import { newFile } from '../NewFile/NewFile.ts'
import { newWindow } from '../NewWindow/NewWindow.ts'
import { openInputWithContext } from '../OpenInput/OpenInput.ts'
import { openUriWithContext } from '../OpenUri/OpenUri.ts'
import { openUrisWithContext } from '../OpenUris/OpenUris.ts'
import { refresh } from '../Refresh/Refresh.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { reopenEditorWith } from '../ReopenEditorWith/ReopenEditorWith.ts'
import { restoreClosedTab } from '../RestoreClosedTab/RestoreClosedTab.ts'
import { save } from '../Save/Save.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'
import {
  flipLayout,
  setEditorLayoutGrid,
  setEditorLayoutSingle,
  setEditorLayoutThreeColumns,
  setEditorLayoutThreeRows,
  setEditorLayoutTwoColumns,
  setEditorLayoutTwoColumnsBottom,
  setEditorLayoutTwoRows,
  setEditorLayoutTwoRowsRight,
} from '../SetEditorLayout/SetEditorLayout.ts'
import { splitDown } from '../SplitDown/SplitDown.ts'
import { splitLeft } from '../SplitLeft/SplitLeft.ts'
import { splitRight } from '../SplitRight/SplitRight.ts'
import { splitUp } from '../SplitUp/SplitUp.ts'

export const commandMap = {
  'Main.closeActiveEditor': wrapSerialCommand(closeActiveEditor),
  'Main.closeAll': wrapSerialCommand(closeAll),
  'Main.CloseAllEditors': wrapSerialCommand(closeAll),
  'Main.closeAllEditors': wrapSerialCommand(closeAll),
  'Main.closeFocusedTab': wrapSerialCommand(closeFocusedTab),
  'Main.closeOthers': wrapSerialCommand(closeOtherTabs),
  'Main.closeSaved': wrapSerialCommand(closeSaved),
  'Main.closeTabsByUris': wrapSerialCommand(closeTabsByUris),
  'Main.closeTabsRight': wrapSerialCommand(closeTabsRight),
  'Main.copyPath': wrapSerialCommand(copyPath),
  'Main.copyRelativePath': wrapSerialCommand(copyRelativePath),
  'Main.focusNext': wrapSerialCommand(focusNextTab),
  'Main.focusNextTab': wrapSerialCommand(focusNextTab),
  'Main.focusPrevious': wrapSerialCommand(focusPreviousTab),
  'Main.focusPreviousTab': wrapSerialCommand(focusPreviousTab),
  'Main.handleModifiedStatusChange': wrapAsyncCommand(handleModifiedStatusChangeWithContext),
  'Main.handleTabContextMenu': wrapSerialCommand(handleTabContextMenu),
  'Main.hasActiveTextEditor': wrapGetter(hasActiveTextEditor),
  'Main.openInput': wrapSerialAsyncCommand(openInputWithContext),
  'Main.openUri': wrapSerialAsyncCommand(openUriWithContext),
  'Main.openUris': wrapSerialAsyncCommand(openUrisWithContext),
  'Main.restoreClosedTab': wrapSerialCommand(restoreClosedTab),
  'Main.save': wrapSerialCommand(save),
  'Main.saveState': wrapGetter(saveState),
  'Main.splitRight': wrapSerialCommand(splitRight),
  'MainArea.closeActiveEditor': wrapSerialCommand(closeActiveEditor),
  'MainArea.closeAll': wrapSerialCommand(closeAll),
  'MainArea.CloseAllEditors': wrapSerialCommand(closeAll),
  'MainArea.closeAllEditors': wrapSerialCommand(closeAll),
  'MainArea.closeEditorGroup': wrapSerialCommand(closeEditorGroup),
  'MainArea.closeFocusedTab': wrapSerialCommand(closeFocusedTab),
  'MainArea.closeOthers': wrapSerialCommand(closeOtherTabs),
  'MainArea.closeSaved': wrapSerialCommand(closeSaved),
  'MainArea.closeTabsByUris': wrapSerialCommand(closeTabsByUris),
  'MainArea.closeTabsRight': wrapSerialCommand(closeTabsRight),
  'MainArea.copyIntoNewWindow': wrapSerialCommand(copyIntoNewWindow),
  'MainArea.copyPath': wrapSerialCommand(copyPath),
  'MainArea.copyRelativePath': wrapSerialCommand(copyRelativePath),
  'MainArea.create': MainArea.create,
  'MainArea.diff2': diff2,
  'MainArea.flipEditorLayout': wrapSerialCommand(flipLayout),
  'MainArea.focusNext': wrapSerialCommand(focusNextTab),
  'MainArea.focusNextTab': wrapSerialCommand(focusNextTab),
  'MainArea.focusPrevious': wrapSerialCommand(focusPreviousTab),
  'MainArea.focusPreviousTab': wrapSerialCommand(focusPreviousTab),
  'MainArea.getCommandIds': getCommandIds,
  'MainArea.getMenuEntries': wrapGetter(getMenuEntries),
  'MainArea.getMenuIds': getMenuIds,
  'MainArea.handleClick': wrapSerialCommand(HandleClick.handleClick),
  'MainArea.handleClickAction': wrapSerialCommand(handleClickAction),
  'MainArea.handleClickCloseTab': wrapSerialCommand(handleClickCloseTab),
  'MainArea.handleClickTab': wrapSerialCommand(handleClickTab),
  'MainArea.handleClickTogglePreview': wrapSerialCommand(handleClickTogglePreview),
  'MainArea.handleContextMenu': wrapSerialCommand(handleContextMenu),
  'MainArea.handleDoubleClick': wrapSerialCommand(handleDoubleClick),
  'MainArea.handleHeaderDoubleClick': wrapSerialCommand(handleHeaderDoubleClick),
  'MainArea.handleIconThemeChange': wrapSerialCommand(handleIconThemeChange),
  'MainArea.handleModifiedStatusChange': wrapAsyncCommand(handleModifiedStatusChangeWithContext),
  'MainArea.handleResize': wrapGetter(handleResize), // TODO would need to have a function that returns newstate as well as commands
  'MainArea.handleSashPointerDown': wrapSerialCommand(handleSashPointerDown),
  'MainArea.handleSashPointerMove': wrapSerialCommand(handleSashPointerMove),
  'MainArea.handleSashPointerUp': wrapSerialCommand(handleSashPointerUp),
  'MainArea.handleTabContextMenu': wrapSerialCommand(handleTabContextMenu),
  'MainArea.handleUriChange': wrapSerialCommand(handleUriChange),
  'MainArea.handleWorkspaceChange': wrapSerialCommand(handleWorkspaceChange),
  'MainArea.handleWorkspaceRefresh': wrapAsyncCommand(handleWorkspaceRefreshWithContext),
  'MainArea.hasActiveTextEditor': wrapGetter(hasActiveTextEditor),
  'MainArea.initialize': initialize,
  'MainArea.loadContent': wrapSerialCommand(LoadContent.loadContent),
  'MainArea.moveIntoNewWindow': wrapSerialCommand(moveIntoNewWindow),
  'MainArea.newFile': wrapSerialCommand(newFile),
  'MainArea.newWindow': wrapSerialCommand(newWindow),
  'MainArea.openInput': wrapSerialAsyncCommand(openInputWithContext),
  'MainArea.openUri': wrapSerialAsyncCommand(openUriWithContext),
  'MainArea.openUris': wrapSerialAsyncCommand(openUrisWithContext),
  'MainArea.refresh': wrapSerialCommand(refresh),
  'MainArea.render2': render2,
  'MainArea.renderEventListeners': renderEventListeners,
  'MainArea.reopenEditorWith': wrapSerialAsyncCommand(reopenEditorWith),
  'MainArea.resize': wrapGetter(handleResize),
  'MainArea.restoreClosedTab': wrapSerialCommand(restoreClosedTab),
  'MainArea.save': wrapSerialCommand(save),
  'MainArea.saveState': wrapGetter(saveState),
  'MainArea.selectTab': wrapSerialCommand(selectTab),
  'MainArea.setEditorLayoutGrid': wrapSerialCommand(setEditorLayoutGrid),
  'MainArea.setEditorLayoutSingle': wrapSerialCommand(setEditorLayoutSingle),
  'MainArea.setEditorLayoutThreeColumns': wrapSerialCommand(setEditorLayoutThreeColumns),
  'MainArea.setEditorLayoutThreeRows': wrapSerialCommand(setEditorLayoutThreeRows),
  'MainArea.setEditorLayoutTwoColumns': wrapSerialCommand(setEditorLayoutTwoColumns),
  'MainArea.setEditorLayoutTwoColumnsBottom': wrapSerialCommand(setEditorLayoutTwoColumnsBottom),
  'MainArea.setEditorLayoutTwoRows': wrapSerialCommand(setEditorLayoutTwoRows),
  'MainArea.setEditorLayoutTwoRowsRight': wrapSerialCommand(setEditorLayoutTwoRowsRight),
  'MainArea.splitDown': wrapSerialCommand(splitDown),
  'MainArea.splitLeft': wrapSerialCommand(splitLeft),
  'MainArea.splitRight': wrapSerialCommand(splitRight),
  'MainArea.splitUp': wrapSerialCommand(splitUp),
  'MainArea.terminate': terminate,
}
