import { ViewletCommand } from '@lvce-editor/constants'
import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import { getCss } from '../GetCss/GetCss.ts'

export const renderCss = (oldState: MainAreaState, newState: MainAreaState): readonly any[] => {
  const css = getCss()
  return [ViewletCommand.SetCss, newState.uid, css]
}
