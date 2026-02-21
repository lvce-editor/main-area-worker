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
      childCount: 1,
      className: ClassNames.EditorGroup,
      style: 'width:100%;',
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
    childCount: 1,
    className: ClassNames.EditorGroup,
    style: 'height:50%;',
    type: VirtualDomElements.Div,
  })
})
