import * as I18nString from '@lvce-editor/i18n'
import { UiStrings } from '../UiStrings/UiStrings.js'

export const openFile = (): string => {
  return I18nString.i18nString(UiStrings.OpenFile)
}

export const splitUp = (): string => {
  return I18nString.i18nString(UiStrings.SplitUp)
}

export const splitDown = (): string => {
  return I18nString.i18nString(UiStrings.SplitDown)
}

export const splitLeft = (): string => {
  return I18nString.i18nString(UiStrings.SplitLeft)
}

export const splitRight = (): string => {
  return I18nString.i18nString(UiStrings.SplitRight)
}

export const newWindow = (): string => {
  return I18nString.i18nString(UiStrings.NewWindow)
}

export const close = (): string => {
  return I18nString.i18nString(UiStrings.Close)
}

export const closeOthers = (): string => {
  return I18nString.i18nString(UiStrings.CloseOthers)
}

export const closeAll = (): string => {
  return I18nString.i18nString(UiStrings.CloseAll)
}

export const revealInExplorer = (): string => {
  return I18nString.i18nString(UiStrings.RevealInExplorer)
}

export const closeToTheRight = (): string => {
  return I18nString.i18nString(UiStrings.CloseToTheRight)
}

export const findFileReferences = (): string => {
  return I18nString.i18nString(UiStrings.FindFileReferences)
}
