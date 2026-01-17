import { ViewletCommand } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'

export const renderItems = (oldState: MainAreaState, newState: MainAreaState): any => {
  return [ViewletCommand.SetDom2, newState.uid, []]
}
