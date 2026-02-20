import { type VirtualDomNode, VirtualDomElements, text } from '@lvce-editor/virtual-dom-worker'
import type { EditorGroup, Tab } from '../MainAreaState/MainAreaState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { isHtmlFile } from '../IsHtmlFile/IsHtmlFile.ts'
import * as MainStrings from '../MainStrings/MainStrings.ts'

export const renderEditorGroupActions = (group: EditorGroup, groupIndex: number, splitButtonEnabled: boolean): readonly VirtualDomNode[] => {
  const activeTab = group.tabs.find((tab: Tab) => tab.id === group.activeTabId)
  const showTogglePreview = isHtmlFile(activeTab)

  if (!splitButtonEnabled && !showTogglePreview) {
    return []
  }

  const buttons: VirtualDomNode[] = []

  if (showTogglePreview) {
    buttons.push(
      {
        ariaLabel: 'Preview',
        childCount: 1,
        className: ClassNames.IconButton,
        'data-action': 'toggle-preview',
        'data-groupId': String(group.id),
        name: 'toggle-preview',
        onClick: DomEventListenerFunctions.HandleClickAction,
        title: MainStrings.togglePreview(),
        type: VirtualDomElements.Button,
      },
      {
        childCount: 0,
        className: ClassNames.MaskIconPreview,
        type: VirtualDomElements.Div,
      },
    )
  }

  if (splitButtonEnabled) {
    buttons.push(
      {
        childCount: 1,
        className: ClassNames.EditorGroupActionButton + ' ' + ClassNames.SplitEditorGroupButton,
        'data-action': 'split-right',
        'data-groupId': String(group.id),
        onClick: DomEventListenerFunctions.HandleClickAction,
        title: MainStrings.splitEditorGroup(),
        type: VirtualDomElements.Button,
      },
      text('split'),
    )
  }

  return [
    {
      childCount: buttons.length / 2, // Each button has 2 nodes (button + text)
      className: ClassNames.EditorGroupActions,
      role: 'toolbar',
      type: VirtualDomElements.Div,
    },
    ...buttons,
  ]
}
