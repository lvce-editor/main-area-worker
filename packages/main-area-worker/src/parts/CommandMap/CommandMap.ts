import { terminate } from '@lvce-editor/viewlet-registry'
import * as MainArea from '../Create/Create.ts'
import { diff2 } from '../Diff2/Diff2.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import { handleClickCloseTab } from '../HandleClickCloseTab/HandleClickCloseTab.ts'
import { handleClickTab } from '../HandleClickTab/HandleClickTab.ts'
import { initialize } from '../Initialize/Initialize.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getCommandIds, wrapCommand } from '../MainAreaStates/MainAreaStates.ts'
import { openUri } from '../OpenUri/OpenUri.ts'
import { render2 } from '../Render2/Render2.ts'
import { renderEventListeners } from '../RenderEventListeners/RenderEventListeners.ts'
import { resize } from '../Resize/Resize.ts'
import { saveState } from '../SaveState/SaveState.ts'

export const commandMap = {
  'MainArea.create': MainArea.create,
  'MainArea.diff2': diff2,
  'MainArea.getCommandIds': getCommandIds,
  'MainArea.handleClick': wrapCommand(HandleClick.handleClick),
  'MainArea.handleClickCloseTab': wrapCommand(handleClickCloseTab),
  'MainArea.handleClickTab': wrapCommand(handleClickTab),
  'MainArea.initialize': initialize,
  'MainArea.loadContent': wrapCommand(LoadContent.loadContent),
  'MainArea.openUri': wrapCommand(openUri),
  'MainArea.render2': render2,
  'MainArea.renderEventListeners': renderEventListeners,
  'MainArea.resize': wrapCommand(resize),
  'MainArea.saveState': saveState,
  'MainArea.terminate': terminate,
}
