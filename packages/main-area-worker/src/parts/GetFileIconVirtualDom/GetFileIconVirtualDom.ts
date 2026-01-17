import { type VirtualDomNode, AriaRoles, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getFileIconVirtualDom = (icon: string): VirtualDomNode => {
  return {
    childCount: 0,
    className: ClassNames.FileIcon,
    role: AriaRoles.None,
    src: icon,
    type: VirtualDomElements.Img,
  }
}
