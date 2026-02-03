import * as I18nString from '@lvce-editor/i18n'
import {
  OpenFile,
  SplitUp,
  SplitDown,
  SplitEditorGroup,
  SplitLeft,
  SplitRight,
  NewWindow,
  Close,
  CloseOthers,
  CloseAll,
  RevealInExplorer,
  CloseToTheRight,
  CopyPath,
  CopyRelativePath,
  FindFileReferences,
} from '../UiStrings/UiStrings.ts'

export const openFile = (): string => {
  return I18nString.i18nString(OpenFile)
}

export const splitUp = (): string => {
  return I18nString.i18nString(SplitUp)
}

export const splitDown = (): string => {
  return I18nString.i18nString(SplitDown)
}

export const splitLeft = (): string => {
  return I18nString.i18nString(SplitLeft)
}

export const splitRight = (): string => {
  return I18nString.i18nString(SplitRight)
}

export const splitEditorGroup = (): string => {
  return I18nString.i18nString(SplitEditorGroup)
}

export const newWindow = (): string => {
  return I18nString.i18nString(NewWindow)
}

export const close = (): string => {
  return I18nString.i18nString(Close)
}

export const closeOthers = (): string => {
  return I18nString.i18nString(CloseOthers)
}

export const closeAll = (): string => {
  return I18nString.i18nString(CloseAll)
}

export const revealInExplorer = (): string => {
  return I18nString.i18nString(RevealInExplorer)
}

export const closeToTheRight = (): string => {
  return I18nString.i18nString(CloseToTheRight)
}

export const findFileReferences = (): string => {
  return I18nString.i18nString(FindFileReferences)
}

export const copyPath = (): string => {
  return I18nString.i18nString(CopyPath)
}

export const copyRelativePath = (): string => {
  return I18nString.i18nString(CopyRelativePath)
}
