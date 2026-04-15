import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const renderWaterMark = (groupId: number): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'WaterMarkWrapper',
      'data-groupId': String(groupId),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'WaterMark',
      'data-groupId': String(groupId),
      type: VirtualDomElements.Div,
    },
  ]
}
