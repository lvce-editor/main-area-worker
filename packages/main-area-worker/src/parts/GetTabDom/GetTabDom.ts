/* eslint-disable unicorn/no-immediate-mutation */
import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { AriaRoles, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DragData from '../DragData/DragData.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as TabFlags from '../TabFlags/TabFlags.ts'

const getIconDom = (icon: string): VirtualDomNode => {
  if (icon.startsWith('MaskIcon')) {
    return {
      childCount: 0,
      className: `TabIcon ${icon}`,
      type: VirtualDomElements.Div,
    }
  }
  return GetFileIconVirtualDom.getFileIconVirtualDom(icon)
}

export const getTabDom = (tab: any): readonly VirtualDomNode[] => {
  const { fixedWidth, flags, icon, isActive, label, tabWidth, uid, uri } = tab
  let tabClassName = ClassNames.MainTab
  if (isActive) {
    tabClassName += ' ' + ClassNames.MainTabSelected
  }
  const isDirty = flags & TabFlags.Dirty
  if (isDirty) {
    tabClassName += ' ' + ClassNames.MainTabModified
  }

  const actualTabWidth = fixedWidth || tabWidth
  const tabElement = {
    ariaSelected: isActive,
    childCount: 2,
    className: tabClassName,
    'data-dragUid': uid,
    draggable: true,
    role: AriaRoles.Tab,
    title: uri,
    type: VirtualDomElements.Div,
    width: actualTabWidth,
  }
  DragData.set(uid, {
    type: 'file',
    uri,
  })
  const dom: any[] = []

  dom.push(
    tabElement,
    getIconDom(icon),
    {
      childCount: 1,
      className: ClassNames.TabLabel,
      type: VirtualDomElements.Div,
    },
    text(label),
  )

  if (isDirty) {
    tabElement.childCount++
    dom.push(
      {
        childCount: 1,
        className: ClassNames.EditorTabCloseButton,
        type: VirtualDomElements.Div,
      },
      {
        childCount: 0,
        className: 'MaskIcon MaskIconCircleFilled',
        type: VirtualDomElements.Div,
      },
    )
  } else {
    tabElement.childCount++
    dom.push(
      {
        childCount: 1,
        className: ClassNames.EditorTabCloseButton,
        title: 'Close',
        type: VirtualDomElements.Button,
      },
      {
        childCount: 0,
        className: 'MaskIcon MaskIconClose',
        type: VirtualDomElements.Div,
      },
    )
  }
  return dom
}
