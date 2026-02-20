import { terminate } from '@lvce-editor/viewlet-registry'
import { closeActiveEditor } from '../CloseActiveEditor/CloseActiveEditor.ts'
import { closeAll } from '../CloseAll/CloseAll.ts'
import { closeFocusedTab } from '../CloseFocusedTab/CloseFocusedTab.ts'
import { closeOtherTabs } from '../CloseOtherTabs/CloseOtherTabs.ts'
import { closeTabsRight } from '../CloseTabsRight/CloseTabsRight.ts'
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
import { handleDoubleClick } from '../HandleDoubleClick/HandleDoubleClick.ts'
import { handleHeaderDoubleClick } from '../HandleHeaderDoubleClick/HandleHeaderDoubleClick.ts'
import { handleModifiedStatusChange } from '../HandleModifiedStatusChange/HandleModifiedStatusChange.ts'
import { handleResize } from '../HandleResize/HandleResize.ts'
import { handleSashPointerDown } from '../HandleSashPointerDown/HandleSashPointerDown.ts'
import { handleSashPointerMove } from '../HandleSashPointerMove/HandleSashPointerMove.ts'
import { handleSashPointerUp } from '../HandleSashPointerUp/HandleSashPointerUp.ts'
import { handleTabContextMenu } from '../HandleTabContextMenu/HandleTabContextMenu.ts'
import { handleUriChange } from '../HandleUriChange/HandleUriChange.ts'
import { handleWorkspaceChange } from '../HandleWorkspaceChange/HandleWorkspaceChange.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../MainAreaStates/MainAreaStates.ts'
import { getMenuEntries } from '../MenuEntries/MenuEntries.ts'
import { newFile } from '../NewFile/NewFile.ts'
import { openUri } from '../OpenUri/OpenUri.ts'
import { refresh } from '../Refresh/Refresh.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { save } from '../Save/Save.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'
import { splitDown } from '../SplitDown/SplitDown.ts'
import { splitRight } from '../SplitRight/SplitRight.ts'

export const commandMap = {
  'MainArea.closeActiveEditor': wrapCommand(closeActiveEditor),
  'MainArea.closeAll': wrapCommand(closeAll),
  'MainArea.closeAllEditors': wrapCommand(closeAll),
  'MainArea.closeFocusedTab': wrapCommand(closeFocusedTab),
  'MainArea.closeOthers': wrapCommand(closeOtherTabs),
  'MainArea.closeTabsRight': wrapCommand(closeTabsRight),
  'MainArea.copyPath': wrapCommand(copyPath),
  'MainArea.copyRelativePath': wrapCommand(copyRelativePath),
  'MainArea.create': MainArea.create,
  'MainArea.diff2': diff2,
  'MainArea.focusNext': wrapCommand(focusNextTab),
  'MainArea.focusNextTab': wrapCommand(focusNextTab),
  'MainArea.focusPrevious': wrapCommand(focusPreviousTab),
  'MainArea.focusPreviousTab': wrapCommand(focusPreviousTab),
  'MainArea.getCommandIds': getCommandIds,
  'MainArea.getMenuEntries': wrapGetter(getMenuEntries),
  'MainArea.getMenuIds': getMenuIds,
  'MainArea.handleClick': wrapCommand(HandleClick.handleClick),
  'MainArea.handleClickAction': wrapCommand(handleClickAction),
  'MainArea.handleClickCloseTab': wrapCommand(handleClickCloseTab),
  'MainArea.handleClickTab': wrapCommand(handleClickTab),
  'MainArea.handleClickTogglePreview': wrapCommand(handleClickTogglePreview),
  'MainArea.handleDoubleClick': wrapCommand(handleDoubleClick),
  'MainArea.handleHeaderDoubleClick': wrapCommand(handleHeaderDoubleClick),
  'MainArea.handleModifiedStatusChange': wrapCommand(handleModifiedStatusChange),
  'MainArea.handleResize': wrapGetter(handleResize), // TODO would need to have a function that returns newstate as well as commands
  'MainArea.handleSashPointerDown': wrapCommand(handleSashPointerDown),
  'MainArea.handleSashPointerMove': wrapCommand(handleSashPointerMove),
  'MainArea.handleSashPointerUp': wrapCommand(handleSashPointerUp),
  'MainArea.handleTabContextMenu': wrapCommand(handleTabContextMenu),
  'MainArea.handleUriChange': wrapCommand(handleUriChange),
  'MainArea.handleWorkspaceChange': wrapCommand(handleWorkspaceChange),
  'MainArea.initialize': initialize,
  'MainArea.loadContent': wrapCommand(LoadContent.loadContent),
  'MainArea.newFile': wrapCommand(newFile),
  'MainArea.openUri': wrapCommand(openUri),
  'MainArea.refresh': wrapCommand(refresh),
  'MainArea.render2': render2,
  'MainArea.renderEventListeners': renderEventListeners,
  'MainArea.resize': wrapGetter(handleResize),
  'MainArea.save': wrapCommand(save),
  'MainArea.saveState': wrapGetter(saveState),
  'MainArea.selectTab': wrapCommand(selectTab),
  'MainArea.splitDown': wrapCommand(splitDown),
  'MainArea.splitRight': wrapCommand(splitRight),
  'MainArea.terminate': terminate,
}
