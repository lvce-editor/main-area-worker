import * as I18nString from '@lvce-editor/i18n'

/**
 * @enum {string}
 */
const UiStrings = {
  Close: 'Close',
  CloseAll: 'Close All',
  CloseOthers: 'Close Others',
  CloseToTheRight: 'Close To The Right',
  FindFileReferences: 'Find File References',
  NewWindow: 'New Window',
  OpenFile: 'Open File',
  RevealInExplorer: 'Reveal in Explorer',
  SplitDown: 'Split Down',
  SplitLeft: 'Split Left',
  SplitRight: 'Split Right',
  SplitUp: 'Split Up',
}

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
