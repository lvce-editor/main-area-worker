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
      params: ['handleClickCloseTab', 'event.currentTarget.dataset.groupIndex', 'event.currentTarget.dataset.index'],
      stopPropagation: true,
    },
    {
      name: DomEventListenersFunctions.HandleClickTab,
      params: ['handleClickTab', 'event.currentTarget.dataset.groupIndex', 'event.currentTarget.dataset.index', EventExpression.Button],
    },
    {
      name: DomEventListenersFunctions.HandleTabKeyDown,
      params: ['handleTabKeyDown', 'event.currentTarget.dataset.groupIndex', 'event.currentTarget.dataset.index', EventExpression.Key],
    },
    {
      name: DomEventListenersFunctions.HandleTabsWheel,
      params: ['handleTabsWheel', 'event.currentTarget.dataset.groupIndex', EventExpression.DeltaMode, EventExpression.DeltaY],
    },
    {
      name: DomEventListenersFunctions.HandleTabDragOver,
      params: [
        'handleTabDragOver',
        'event.currentTarget.dataset.groupIndex',
        'event.currentTarget.dataset.index',
        'event.currentTarget.offsetLeft',
        'event.currentTarget.offsetWidth',
        'event.currentTarget.parentElement.scrollLeft',
        EventExpression.ClientX,
        EventExpression.ClientY,
      ],
      preventDefault: true,
      stopPropagation: true,
    },
    {
      name: DomEventListenersFunctions.HandleTabsDragOver,
      params: ['handleTabsDragOver', 'event.currentTarget.dataset.groupIndex', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
      stopPropagation: true,
    },
    {
      name: DomEventListenersFunctions.HandleDoubleClick,
      params: ['handleDoubleClick', 'event.target.dataset.groupIndex', 'event.target.dataset.index'],
    },
    {
      name: DomEventListenersFunctions.HandleContextMenu,
      params: ['handleContextMenu', 'event.target.dataset.groupId', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleTabContextMenu,
      params: [
        'handleTabContextMenu',
        EventExpression.Button,
        EventExpression.ClientX,
        EventExpression.ClientY,
        'event.target.dataset.groupIndex',
        'event.target.dataset.index',
      ],
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
      preventDefault: true,
      trackPointerEvents: [DomEventListenersFunctions.HandleSashPointerMove, DomEventListenersFunctions.HandleSashPointerUp],
    },
    {
      name: DomEventListenersFunctions.HandleSashPointerMove,
      params: ['handleSashPointerMove', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleSashPointerUp,
      params: ['handleSashPointerUp', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleSashCornerPointerDown,
      params: ['handleSashCornerPointerDown', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
      trackPointerEvents: [DomEventListenersFunctions.HandleSashCornerPointerMove, DomEventListenersFunctions.HandleSashCornerPointerUp],
    },
    {
      name: DomEventListenersFunctions.HandleSashCornerPointerMove,
      params: ['handleSashCornerPointerMove', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleSashCornerPointerUp,
      params: ['handleSashCornerPointerUp', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleDragOver,
      params: ['handleDragOver', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragLeave,
      params: ['handleDragLeave'],
    },
    {
      name: DomEventListenersFunctions.HandleDrop,
      params: ['handleDrop', EventExpression.DropId],
      preventDefault: true,
    },
    {
      dragEffect: 'copyMove',
      name: DomEventListenersFunctions.HandleDragStart,
      params: ['handleDragStart'],
    },
    {
      name: DomEventListenersFunctions.HandleDragEnd,
      params: ['handleDragEnd'],
    },
    {
      name: DomEventListenersFunctions.HandleTabMouseUp,
      params: ['handleTabMouseUp'],
    },
  ]
}
