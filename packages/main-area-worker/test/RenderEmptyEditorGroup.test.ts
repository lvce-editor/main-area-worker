import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MainStrings from '../src/parts/MainStrings/MainStrings.ts'
import { renderEmptyEditorGroup } from '../src/parts/RenderEmptyEditorGroup/RenderEmptyEditorGroup.ts'

test('renderEmptyEditorGroup should return empty group and close button', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = renderEmptyEditorGroup(group, 0, 'width:100%;')

  expect(result).toEqual([
    {
      childCount: 2,
      className: ClassNames.EditorGroup,
      'data-groupId': '1',
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      style: 'width:100%;',
      tabIndex: 0,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.EmptyGroupHeader,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.EmptyGroupCloseButton,
      'data-groupId': '1',
      name: 'close-group',
      onClick: DomEventListenerFunctions.HandleClickAction,
      title: MainStrings.closeEditorGroup(),
      type: VirtualDomElements.Button,
    },
    text('✕'),
    {
      childCount: 1,
      className: 'WaterMarkWrapper',
      'data-groupId': '1',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'WaterMark',
      'data-groupId': '1',
      type: VirtualDomElements.Div,
    },
  ])
})

test('renderEmptyEditorGroup should use provided style', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 2,
    isEmpty: true,
    size: 50,
    tabs: [],
  }

  const result = renderEmptyEditorGroup(group, 0, 'height:50%;')

  expect(result[0]).toEqual({
    childCount: 2,
    className: ClassNames.EditorGroup,
    'data-groupId': '2',
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
    style: 'height:50%;',
    tabIndex: 0,
    type: VirtualDomElements.Div,
  })
})
