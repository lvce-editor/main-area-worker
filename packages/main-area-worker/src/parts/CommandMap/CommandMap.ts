import { terminate } from '@lvce-editor/viewlet-registry'
import { closeAll } from '../CloseAll/CloseAll.ts'
import * as MainArea from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import { getMenuIds } from '../GetMenuIds/GetMenuIds.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { handleClickCloseTab } from '../HandleClickCloseTab/HandleClickCloseTab.ts'
import { handleClickTab } from '../HandleClickTab/HandleClickTab.ts'
import { handleTabContextMenu } from '../HandleTabContextMenu/HandleTabContextMenu.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getCommandIds, wrapCommand, wrapGetter } from '../MainAreaStates/MainAreaStates.ts'
import { getMenuEntries } from '../MenuEntries/MenuEntries.ts'
import { openUri } from '../OpenUri/OpenUri.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'
import { selectTab } from '../SelectTab/SelectTab.ts'

export const commandMap = {
  'MainArea.closeAll': wrapCommand(closeAll),
  'MainArea.create': MainArea.create,
  'MainArea.diff2': diff2,
  'MainArea.getCommandIds': getCommandIds,
  'MainArea.getMenuEntries': wrapGetter(getMenuEntries),
  'MainArea.getMenuIds': getMenuIds,
  'MainArea.handleClick': wrapCommand(HandleClick.handleClick),
  'MainArea.handleClickCloseTab': wrapCommand(handleClickCloseTab),
  'MainArea.handleClickTab': wrapCommand(handleClickTab),
  'MainArea.handleTabContextMenu': wrapCommand(handleTabContextMenu),
  'MainArea.initialize': initialize,
  'MainArea.loadContent': wrapCommand(LoadContent.loadContent),
  'MainArea.openUri': wrapCommand(openUri),
  'MainArea.render2': render2,
  'MainArea.renderEventListeners': renderEventListeners,
  'MainArea.resize': wrapCommand(resize),
  'MainArea.saveState': saveState,
  'MainArea.selectTab': wrapCommand(selectTab),
  'MainArea.terminate': terminate,
}
