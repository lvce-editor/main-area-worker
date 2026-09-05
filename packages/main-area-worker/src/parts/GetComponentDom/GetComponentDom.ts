import { getComponentState } from '../GetComponentState/GetComponentState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

export const getComponentDom = (uid: number): readonly any[] => {
  const state = getComponentState(uid)
  return renderItems(state, state)[2]
}
