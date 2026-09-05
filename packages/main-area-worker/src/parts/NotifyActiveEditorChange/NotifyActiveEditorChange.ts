import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as GetActiveFileUri from '../GetActiveFileUri/GetActiveFileUri.ts'

export const notifyActiveEditorChange = async (oldState: MainAreaState, newState: MainAreaState): Promise<void> => {
  const oldUri = GetActiveFileUri.getActiveFileUri(oldState)
  const newUri = GetActiveFileUri.getActiveFileUri(newState)
  if (oldUri === newUri) {
    return
  }
  try {
    await ApplicationRpc.invoke(newState.applicationId, 'Layout.handleActiveEditorChange', newUri)
  } catch (error) {
    console.warn('Failed to notify viewlets about active editor change', error)
  }
}
