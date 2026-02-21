import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const renderWaterMark = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className: 'WaterMark',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'WaterMarkContent',
      type: VirtualDomElements.Div,
    },
  ]
}
