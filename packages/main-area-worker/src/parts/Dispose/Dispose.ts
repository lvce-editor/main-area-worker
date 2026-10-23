import { disposeEditors } from '../DisposeEditors/DisposeEditors.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'

export const dispose = async (uid: number): Promise<void> => {
  const instance = MainAreaStates.get(uid)
  if (!instance) {
    return
  }
  const editorUids = instance.newState.layout.groups.flatMap((group) => group.tabs.map((tab) => tab.editorUid).filter((id) => id !== -1))
  MainAreaStates.dispose(uid)
  await disposeEditors(editorUids)
}
