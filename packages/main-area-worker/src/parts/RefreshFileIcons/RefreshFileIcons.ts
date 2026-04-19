import { handleIconThemeChange } from '../HandleIconThemeChange/HandleIconThemeChange.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'

export const refreshFileIcons = async (): Promise<void> => {
  const keys = MainAreaStates.getKeys()
  for (const uid of keys) {
    const { newState, oldState } = MainAreaStates.get(uid)
    const updatedState = await handleIconThemeChange(newState)
    MainAreaStates.set(uid, oldState, updatedState)
  }
}
