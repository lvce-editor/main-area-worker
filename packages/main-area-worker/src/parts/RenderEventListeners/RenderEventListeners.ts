import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', EventExpression.TargetName],
    },
    {
      name: DomEventListenersFunctions.HandleClickClose,
      params: ['handleClickCloseTab', 'event.target.dataset.groupIndex', 'event.target.dataset.index'],
    },
    {
      name: DomEventListenersFunctions.HandleClickTab,
      params: ['handleClickTab', 'event.target.dataset.groupIndex', 'event.target.dataset.index'],
    },
    {
      name: DomEventListenersFunctions.HandleTabContextMenu,
      params: ['handleTabContextMenu', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
  ]
}
