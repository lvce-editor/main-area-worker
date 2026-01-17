import * as Diff from '../Diff/Diff.ts'
import * as MainAreaStates from '../MainAreaStates/MainAreaStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { newState, oldState } = MainAreaStates.get(uid)
  const result = Diff.diff(oldState, newState)
  return result
}
