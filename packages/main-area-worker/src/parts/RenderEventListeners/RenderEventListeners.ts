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
    {
      name: DomEventListenersFunctions.HandleClickAction,
      params: ['handleClickAction', EventExpression.TargetName, 'event.target.dataset.groupId'],
    },
    {
      name: DomEventListenersFunctions.HandleHeaderDoubleClick,
      params: ['handleHeaderDoubleClick', EventExpression.EventTargetClassName, 'event.target.dataset.groupId'],
    },
    {
      name: DomEventListenersFunctions.HandleSashPointerDown,
      params: ['handleSashPointerDown', 'event.target.dataset.sashId', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleSashPointerMove,
      params: ['handleSashPointerMove', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleSashPointerUp,
      params: ['handleSashPointerUp', EventExpression.ClientX, EventExpression.ClientY],
    },
  ]
}
