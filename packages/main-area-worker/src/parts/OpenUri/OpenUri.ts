import type { MainAreaState } from '../MainAreaState/MainAreaState.ts'
import type { OpenUriOptions } from '../OpenUriOptions/OpenUriOptions.ts'
import * as Assert from '../Assert/Assert.ts'

export const openUri = async (state: MainAreaState, options: OpenUriOptions): Promise<MainAreaState> => {
  Assert.object(state)
  Assert.object(options)

  // TODO
  return {
    ...state,
  }
}
