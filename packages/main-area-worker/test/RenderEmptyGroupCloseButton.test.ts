import { expect, test } from '@jest/globals'
import { VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup } from '../src/parts/MainAreaState/MainAreaState.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MainStrings from '../src/parts/MainStrings/MainStrings.ts'
import { renderEmptyGroupCloseButton } from '../src/parts/RenderEmptyGroupCloseButton/RenderEmptyGroupCloseButton.ts'

test('renderEmptyGroupCloseButton should return close button for empty group', () => {
  const group: EditorGroup = {
    activeTabId: undefined,
    focused: false,
    id: 1,
    isEmpty: true,
    size: 100,
    tabs: [],
  }

  const result = renderEmptyGroupCloseButton(group, 0)

  expect(result).toEqual([
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
